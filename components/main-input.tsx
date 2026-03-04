'use client'

import { useSessionId } from 'convex-helpers/react/sessions'
import { useMutation } from 'convex/react'
import { ChangeEvent, useRef, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'

import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { api } from '@/convex/_generated/api'
import useTime from '@/hooks/useTime'
import { calculateAccuracy, calculateWPM, cn } from '@/lib/utils'

type Props = {
  currentSentence: string | undefined
}

export default function MainInput({ currentSentence }: Props) {
  const [sessionId] = useSessionId()
  const updateProgress = useMutation(api.user.updateProgress)

  const [value, setValue] = useState('')
  const totalKeystrokesRef = useRef(0)
  const errorKeystrokesRef = useRef(0)

  const [startTime, setStartTime] = useState<number | null>(null)
  const time = useTime()

  const debouncedUpdateProgress = useDebounceCallback(() => {
    if (!sessionId || !currentSentence || !startTime) return

    const wpm = calculateWPM(value, currentSentence, startTime, time.getTime())
    const accuracy = calculateAccuracy(
      totalKeystrokesRef.current,
      errorKeystrokesRef.current,
      currentSentence,
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
      if (val[newCharIndex] !== currentSentence?.[newCharIndex]) {
        errorKeystrokesRef.current += 1
      }
    }

    setValue(val)
    debouncedUpdateProgress()
  }

  return (
    <Field>
      <FieldLabel
        htmlFor="main-input"
        className={cn(!currentSentence && 'sr-only')}
      >
        Type word above as fast as you can!
      </FieldLabel>
      <Input
        disabled={!currentSentence || currentSentence === value}
        id="main-input"
        type="text"
        value={value}
        onChange={handleChange}
        aria-invalid={value !== '' && !currentSentence?.startsWith(value)}
        className="aria-invalid:bg-destructive/30"
      />
    </Field>
  )
}
