'use client'

import { SessionProvider } from 'convex-helpers/react/sessions'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ReactNode } from 'react'
import { useLocalStorage } from 'usehooks-ts'

type Props = {
  children: ReactNode
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function Providers({ children }: Props) {
  return (
    <ConvexProvider client={convex}>
      <SessionProvider useStorage={useLocalStorage}>{children}</SessionProvider>
    </ConvexProvider>
  )
}
