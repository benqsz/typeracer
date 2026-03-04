'use client'

import { useSessionId } from 'convex-helpers/react/sessions'
import { useMutation, useQuery } from 'convex/react'
import { useEffect } from 'react'

import { api } from '@/convex/_generated/api'
import { PING_TIME } from '@/lib/constants'

export default function useGame() {
  const [sessionId] = useSessionId()

  const initUser = useMutation(api.user.init)
  const pingUser = useMutation(api.user.ping)
  const initGame = useMutation(api.game.init)

  const lobby = useQuery(api.user.getLobby)

  useEffect(() => {
    initGame()
  }, [initGame])

  useEffect(() => {
    if (!sessionId) return
    initUser({ sessionId })
  }, [sessionId, initUser])

  useEffect(() => {
    if (!sessionId) return
    pingUser({ sessionId })

    const interval = setInterval(() => {
      pingUser({ sessionId })
    }, PING_TIME)

    return () => clearInterval(interval)
  }, [sessionId, pingUser])

  return {
    currentUserId: sessionId,
    lobby,
  }
}
