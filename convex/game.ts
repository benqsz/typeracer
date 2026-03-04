import { v } from 'convex/values'

import { internal } from '@/convex/_generated/api'
import {
  internalAction,
  internalMutation,
  query,
} from '@/convex/_generated/server'
import {
  ACTIVITY_TIMEOUT,
  FINISH_TIME,
  GAME_STATUS,
  MIN_PLAYERS,
  ROUND_TIME,
  SentenceData,
  WARMUP_TIME,
} from '@/lib/constants'

export const get = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('game').first()
  },
})

export const init = internalMutation({
  args: {},
  handler: async ctx => {
    const game = await ctx.db.query('game').first()

    if (!game) {
      await ctx.db.insert('game', {
        status: GAME_STATUS.WAITING,
      })
    }
  },
})

export const prepareRound = internalMutation({
  args: {},
  handler: async ctx => {
    const game = await ctx.db.query('game').first()

    if (!game || game.status !== GAME_STATUS.WAITING) return

    const now = Date.now()
    const activeUsers = await ctx.db
      .query('user')
      .withIndex('by_lastActiveTime', q =>
        q.gte('lastActiveTime', now - ACTIVITY_TIMEOUT),
      )
      .collect()

    if (activeUsers.length >= MIN_PLAYERS) {
      await ctx.db.patch(game._id, {
        status: GAME_STATUS.STARTING,
        warmupEndTime: now + WARMUP_TIME,
      })

      await ctx.scheduler.runAfter(WARMUP_TIME, internal.game.getSentence)
    }
  },
})

export const getSentence = internalAction({
  args: {},
  handler: async ctx => {
    const res = await fetch(`${process.env.APP_URL}/api/sentence`)
    const data: SentenceData = await res.json()
    await ctx.runMutation(internal.game.startRound, {
      sentence: data[0].content,
    })
  },
})

export const startRound = internalMutation({
  args: { sentence: v.string() },
  handler: async (ctx, { sentence }) => {
    const game = await ctx.db.query('game').first()

    if (!game || game.status !== GAME_STATUS.STARTING) {
      console.error('Game not found or not in starting status')
      return
    }

    const now = Date.now()
    const activeUsers = await ctx.db
      .query('user')
      .withIndex('by_lastActiveTime', q =>
        q.gte('lastActiveTime', now - ACTIVITY_TIMEOUT),
      )
      .collect()

    for (const user of activeUsers) {
      await ctx.db.patch(user._id, {
        progress: undefined,
        wpm: undefined,
        accuracy: undefined,
      })
    }

    await ctx.db.patch(game._id, {
      status: GAME_STATUS.PLAYING,
      roundEndTime: now + ROUND_TIME,
      currentSentence: sentence,
      winnerId: '',
    })

    await ctx.scheduler.runAfter(ROUND_TIME, internal.game.finishRound)
  },
})

export const finishRound = internalMutation({
  args: {},
  handler: async ctx => {
    const game = await ctx.db.query('game').first()

    if (!game || game.status !== GAME_STATUS.PLAYING) {
      console.error('Game not found')
      return
    }

    await ctx.db.patch(game._id, {
      status: GAME_STATUS.FINISHED,
      // TODO calculate winner
      winnerId: undefined,
    })

    await ctx.scheduler.runAfter(FINISH_TIME, internal.game.restartRound)
  },
})

export const restartRound = internalMutation({
  args: {},
  handler: async ctx => {
    const game = await ctx.db.query('game').first()

    if (!game || game.status !== GAME_STATUS.FINISHED) {
      console.error('Game not found')
      return
    }

    await ctx.db.patch(game._id, {
      status: GAME_STATUS.WAITING,
      warmupEndTime: undefined,
      roundEndTime: undefined,
      currentSentence: undefined,
      winnerId: undefined,
    })

    await ctx.scheduler.runAfter(0, internal.game.prepareRound)
  },
})
