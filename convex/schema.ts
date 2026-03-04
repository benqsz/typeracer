import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

import { gameStatus } from '@/convex/types'

export default defineSchema({
  user: defineTable({
    sessionId: v.string(),
    username: v.string(),
    lastActiveTime: v.number(),
    progress: v.optional(v.string()),
    wpm: v.optional(v.string()),
    accuracy: v.optional(v.string()),
  })
    .index('by_sessionId', ['sessionId'])
    .index('by_lastActiveTime', ['lastActiveTime']),

  game: defineTable({
    status: v.union(
      v.literal(gameStatus.WAITING),
      v.literal(gameStatus.PLAYING),
      v.literal(gameStatus.FINISHED),
    ),
    countdownEndTime: v.optional(v.number()),
    roundEndTime: v.optional(v.number()),
    currentSentence: v.optional(v.string()),
    winnerId: v.optional(v.string()),
  }),
})
