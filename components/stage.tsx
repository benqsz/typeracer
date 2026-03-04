'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useGame } from '@/hooks/useGame'
import { GAME_STATUS } from '@/lib/constants'

export default function Stage() {
  const { game } = useGame()

  if (!game) return <Skeleton className="w-full h-8" />

  let stageText = ''
  switch (game?.status) {
    case GAME_STATUS.WAITING:
      stageText = 'Waiting for players to join...'
      break
    case GAME_STATUS.STARTING:
      stageText = 'Game will start in ...'
      break
    case GAME_STATUS.PLAYING:
      stageText = game?.currentSentence || ''
      break
    case GAME_STATUS.FINISHED:
      stageText = 'The winner is: '
      break
  }

  return <h1 className="text-2xl font-bold">{stageText}</h1>
}
