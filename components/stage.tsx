'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGame } from '@/hooks/useGame'
import useTime from '@/hooks/useTime'
import { GAME_STATUS } from '@/lib/constants'
import { secondsToRelativeTime } from '@/lib/utils'

export default function Stage() {
  const { game, serverTimeOffset } = useGame()
  const time = useTime()
  if (!game) return <Skeleton className="w-full h-8" />

  const syncedTime = time.getTime() + serverTimeOffset
  const secondsToRoundStart = secondsToRelativeTime(
    game.warmupEndTime || 0,
    syncedTime,
  )
  const secondsToRoundEnd = secondsToRelativeTime(
    game.roundEndTime || 0,
    syncedTime,
  )

  let stageText = ''
  switch (game?.status) {
    case GAME_STATUS.WAITING:
      stageText = 'Waiting for players to join...'
      break
    case GAME_STATUS.STARTING:
      stageText = `Game will start in ${secondsToRoundStart}...`
      break
    case GAME_STATUS.PLAYING:
      stageText = game?.currentSentence || ''
      break
    case GAME_STATUS.FINISHED:
      stageText = 'The winner is: '
      break
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-2xl font-bold">{stageText}</h1>
      {game.status === GAME_STATUS.PLAYING && (
        <span className="text-xs text-muted-foreground">
          Time left: {secondsToRoundEnd}
        </span>
      )}
    </div>
  )
}
