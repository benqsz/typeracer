// in milliseconds
export const PING_TIME = 5 * 1000
export const ACTIVITY_TIMEOUT = 5 * 1000
export const WARMUP_TIME = 5 * 1000
export const ROUND_TIME = 60 * 1000
export const FINISH_TIME = 10 * 1000

export const MIN_PLAYERS = 2

export const GAME_STATUS = {
  WAITING: 'WAITING',
  STARTING: 'STARTING',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
} as const
