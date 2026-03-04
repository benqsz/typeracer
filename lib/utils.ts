import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateWPM(
  value: string,
  currentSentence: string,
  startTime: number,
  now: number,
) {
  if (!startTime || value.length === 0) return 0

  const minutes = (now - startTime) / 60000
  if (minutes === 0) return 0

  const sentenceWords = currentSentence.split(' ')
  const typedWords = value.split(' ')

  const correctWords = typedWords.filter(
    (word, i) => word === sentenceWords[i],
  ).length

  return Math.round(correctWords / minutes)
}

export function calculateAccuracy(
  totalKeystrokes: number,
  errorKeystrokes: number,
  currentSentence: string,
) {
  if (totalKeystrokes === 0) return 100
  const correctKeystrokes = totalKeystrokes - errorKeystrokes
  return Math.round((correctKeystrokes / currentSentence.length) * 100)
}

export function secondsToRelativeTime(targetMs: number, nowMs: number) {
  const diff = targetMs - nowMs
  return Math.max(0, Math.floor(diff / 1000))
}
