'use client'

import { useSessionId } from 'convex-helpers/react/sessions'

export default function HomePage() {
  const [sessionId] = useSessionId()
  console.log(sessionId)
  return <div>home page </div>
}
