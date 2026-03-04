'use client'

import { useEffect, useState } from 'react'

export default function useTime() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return currentTime
}
