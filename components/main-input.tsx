'use client'

import { useMutation } from 'convex/react'
import { ChangeEvent, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { useGame } from '@/hooks/useGame'
import useTime from '@/hooks/useTime'
import { GAME_STATUS } from '@/lib/constants'
import { calculateAccuracy, calculateWPM } from '@/lib/utils'

export default function MainInput() {
  const { sessionId, game } = useGame()
  const updateProgress = useMutation(api.user.updateProgress)

  const [value, setValue] = useState('')
  const totalKeystrokesRef = useRef(0)
  const errorKeystrokesRef = useRef(0)

  const [startTime, setStartTime] = useState<number | null>(null)
  const time = useTime()

  const debouncedUpdateProgress = useDebounceCallback(() => {
    if (!sessionId || !game?.currentSentence || !startTime) return

    const wpm = calculateWPM(
      value,
      game.currentSentence,
      startTime,
      time.getTime(),
    )
    const accuracy = calculateAccuracy(
      totalKeystrokesRef.current,
      errorKeystrokesRef.current,
      game.currentSentence,
    )

    updateProgress({ sessionId, wpm, accuracy, progress: value })
  }, 500)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    if (!startTime && val.length > 0) {
      setStartTime(Date.now())
    }

    if (val.length > value.length) {
      const newCharIndex = val.length - 1
      totalKeystrokesRef.current += 1
      if (val[newCharIndex] !== game?.currentSentence?.[newCharIndex]) {
        errorKeystrokesRef.current += 1
      }
    }

    setValue(val)
    debouncedUpdateProgress()
  }

  if (!game || !sessionId) return <Skeleton className="w-full h-8" />

  return (
    <Field>
      <FieldLabel htmlFor="main-input">
        Type word above as fast as you can!
      </FieldLabel>
      <Input
        disabled={game?.status !== GAME_STATUS.PLAYING}
        id="main-input"
        type="text"
        value={value}
        onChange={handleChange}
        aria-invalid={value !== '' && !game?.currentSentence?.startsWith(value)}
        className="aria-invalid:bg-destructive/30"
      />
    </Field>
  )
}
