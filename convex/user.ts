import { v } from 'convex/values'

import { mutation, query } from '@/convex/_generated/server'
import { ACTIVITY_TIMEOUT } from '@/lib/constants'

export const init = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('user')
      .withIndex('by_sessionId', q => q.eq('sessionId', args.sessionId))
      .unique()

    if (!user) {
      const randomNumber = Math.floor(Math.random() * 10000)
      await ctx.db.insert('user', {
        sessionId: args.sessionId,
        username: `Anon_${randomNumber}`,
        lastActiveTime: Date.now(),
      })
    }
  },
})

export const ping = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('user')
      .withIndex('by_sessionId', q => q.eq('sessionId', args.sessionId))
      .unique()

    if (user) {
      const now = Date.now()
      await ctx.db.patch(user._id, {
        lastActiveTime: now,
      })
    }
  },
})

export const getLobby = query({
  args: {},
  handler: async ctx => {
    const now = Date.now()

    return await ctx.db
      .query('user')
      .withIndex('by_lastActiveTime', q =>
        q.gte('lastActiveTime', now - ACTIVITY_TIMEOUT),
      )
      .collect()
  },
})
