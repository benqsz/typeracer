import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { GAME_STATUS } from '@/lib/constants'

export default defineSchema({
  user: defineTable({
    sessionId: v.string(),
    username: v.string(),
    lastActiveTime: v.number(),
    progress: v.optional(v.string()),
    wpm: v.optional(v.number()),
    accuracy: v.optional(v.number()),
  })
    .index('by_sessionId', ['sessionId'])
    .index('by_lastActiveTime', ['lastActiveTime']),

  game: defineTable({
    status: v.union(
      v.literal(GAME_STATUS.WAITING),
      v.literal(GAME_STATUS.STARTING),
      v.literal(GAME_STATUS.PLAYING),
      v.literal(GAME_STATUS.FINISHED),
    ),
    warmupEndTime: v.optional(v.number()),
    roundEndTime: v.optional(v.number()),
    currentSentence: v.optional(v.string()),
    winnerId: v.optional(v.string()),
  }),
})
