import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface StudyProgressData {
  knownWords: Set<number>
  lastStudied: { [key: number]: string }
  studyStreak: number
}

export function useStudyProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<StudyProgressData>({
    knownWords: new Set(),
    lastStudied: {},
    studyStreak: 0
  })

  // Load progress from localStorage on mount
  useEffect(() => {
    if (!user) return

    try {
      const saved = globalThis.localStorage.getItem(`study-progress-${user.id}`)
      if (saved) {
        const data = JSON.parse(saved)
        setProgress({
          ...data,
          knownWords: new Set(data.knownWords)
        })
      }
    } catch (e) {
      console.error('Error loading study progress:', e)
    }
  }, [user])

  // Save progress to localStorage when it changes
  useEffect(() => {
    if (!user) return

    try {
      const data = {
        ...progress,
        knownWords: Array.from(progress.knownWords)
      }
      globalThis.localStorage.setItem(`study-progress-${user.id}`, JSON.stringify(data))
    } catch (e) {
      console.error('Error saving study progress:', e)
    }
  }, [progress, user])

  const markWordAsKnown = (wordId: number) => {
    setProgress(prev => {
      const newKnownWords = new Set(prev.knownWords)
      newKnownWords.add(wordId)
      return {
        ...prev,
        knownWords: newKnownWords,
        lastStudied: {
          ...prev.lastStudied,
          [wordId]: new Date().toISOString()
        }
      }
    })
  }

  const updateStudyStreak = () => {
    const now = new Date()
    const today = now.toDateString()
    const lastStudyDay = globalThis.localStorage.getItem(`last-study-day-${user?.id}`)

    if (lastStudyDay !== today) {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastStudyDay === yesterday.toDateString()) {
        // Studied yesterday, increment streak
        setProgress(prev => ({
          ...prev,
          studyStreak: prev.studyStreak + 1
        }))
      } else {
        // Didn't study yesterday, reset streak
        setProgress(prev => ({
          ...prev,
          studyStreak: 1
        }))
      }

      globalThis.localStorage.setItem(`last-study-day-${user?.id}`, today)
    }
  }

  return {
    progress,
    markWordAsKnown,
    updateStudyStreak
  }
}