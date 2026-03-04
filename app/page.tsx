'use client'

import MainInput from '@/components/main-input'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import useGame from '@/hooks/useGame'
import { GAME_STATUS } from '@/lib/constants'

export default function HomePage() {
  const { lobby, currentUserId, game } = useGame()

  if (!lobby || !game)
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        <h1>Loading...</h1>
        <Spinner className="size-12" />
      </div>
    )

  let stageText = ''
  switch (game.status) {
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

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-2xl font-bold">{stageText}</h1>
      <Separator />
      <MainInput currentSentence={game.currentSentence} />
      <Separator />
      <div>
        <h2 className="font-semibold mb-2">Current lobby: </h2>
        <ul>
          {lobby
            .sort((a, b) => (b.sessionId === currentUserId ? 1 : 0))
            .map(player => (
              <li key={player.sessionId}>
                {player.username}{' '}
                {player.sessionId === currentUserId && '(You)'}-{' '}
                {player.progress} WPM: {player.wpm} Accuracy: {player.accuracy}%
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
