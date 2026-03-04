'use client'

import { useSessionId } from 'convex-helpers/react/sessions'
import { SessionId } from 'convex-helpers/server/sessions'
import { useMutation, useQuery } from 'convex/react'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { api } from '@/convex/_generated/api'
import { PING_TIME } from '@/lib/constants'

type GameContextType = {
  sessionId: SessionId | undefined
  lobby:
    | {
        progress?: string | undefined
        wpm?: number | undefined
        accuracy?: number | undefined
        sessionId: string
        username: string
        lastActiveTime: number
      }[]
    | undefined
  game:
    | {
        warmupEndTime?: number | undefined
        roundEndTime?: number | undefined
        currentSentence?: string | undefined
        winnerId?: string | undefined
        status: 'WAITING' | 'STARTING' | 'PLAYING' | 'FINISHED'
      }
    | null
    | undefined
  serverTimeOffset: number
}

const GameContext = createContext<GameContextType | null>(null)

type Props = {
  children: ReactNode
}

export default function GameProvider({ children }: Props) {
  const [sessionId] = useSessionId()
  const [serverTimeOffset, setServerTimeOffset] = useState(0)

  const initUser = useMutation(api.user.init)
  const pingUser = useMutation(api.user.ping)

  const lobby = useQuery(api.user.getLobby)
  const game = useQuery(api.game.get)

  useEffect(() => {
    if (!sessionId) return
    initUser({ sessionId })
  }, [sessionId, initUser])

  useEffect(() => {
    if (!sessionId) return
    pingUser({ sessionId })

    const interval = setInterval(async () => {
      const serverTime = await pingUser({ sessionId })
      setServerTimeOffset(serverTime - Date.now())
    }, PING_TIME)

    return () => clearInterval(interval)
  }, [sessionId, pingUser])

  return (
    <GameContext.Provider value={{ sessionId, lobby, game, serverTimeOffset }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within a GameProvider')
  return context
}
