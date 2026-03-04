'use client'

import { Spinner } from '@/components/ui/spinner'
import useGame from '@/hooks/useGame'

export default function HomePage() {
  const { lobby, currentUserId } = useGame()

  if (!lobby)
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center">
        <h1>Loading...</h1>
        <Spinner className="size-12" />
      </div>
    )

  return (
    <div>
      <ul>
        {lobby?.map(player => (
          <li key={player.sessionId}>
            {player.username} {player.sessionId === currentUserId && '(You)'}
          </li>
        ))}
      </ul>
    </div>
  )
}
