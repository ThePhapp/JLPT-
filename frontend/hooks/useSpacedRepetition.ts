import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { VocabularyWord, StudyProgress } from '@/types/vocabulary'

const INITIAL_EASE_FACTOR = 2.5
const MINIMUM_EASE_FACTOR = 1.3
const EASE_BONUS = 0.15
const EASE_PENALTY = 0.2

export function useSpacedRepetition() {
  const { user } = useAuth()
  const [studyProgress, setStudyProgress] = useState<Record<number, StudyProgress>>({})

  // Load study progress from localStorage
  useEffect(() => {
    if (!user) return

    try {
      const saved = localStorage.getItem(`study-progress-${user.id}`)
      if (saved) {
        setStudyProgress(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading study progress:', error)
    }
  }, [user])

  // Save progress whenever it changes
  useEffect(() => {
    if (!user) return

    try {
      localStorage.setItem(`study-progress-${user.id}`, JSON.stringify(studyProgress))
    } catch (error) {
      console.error('Error saving study progress:', error)
    }
  }, [studyProgress, user])

  const calculateNextReview = (
    currentProgress: StudyProgress | null,
    wasCorrect: boolean
  ): StudyProgress => {
    const now = new Date()

    if (!currentProgress) {
      // New word
      return {
        wordId: -1, // Will be set by caller
        status: 'learning',
        lastReviewed: now.toISOString(),
        nextReview: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        repetitions: 1,
        easeFactor: INITIAL_EASE_FACTOR,
        interval: 1
      }
    }

    let { status, repetitions, easeFactor, interval } = currentProgress

    if (wasCorrect) {
      // Correct answer
      repetitions += 1
      easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor + EASE_BONUS)

      if (repetitions === 1) {
        interval = 1 // 1 day
      } else if (repetitions === 2) {
        interval = 3 // 3 days
      } else {
        interval = Math.round(interval * easeFactor)
      }

      status = repetitions >= 4 ? 'mastered' : 'reviewing'
    } else {
      // Incorrect answer
      repetitions = 1
      easeFactor = Math.max(MINIMUM_EASE_FACTOR, easeFactor - EASE_PENALTY)
      interval = 1
      status = 'learning'
    }

    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)

    return {
      ...currentProgress,
      status,
      lastReviewed: now.toISOString(),
      nextReview: nextReview.toISOString(),
      repetitions,
      easeFactor,
      interval
    }
  }

  const updateWordProgress = (wordId: number, wasCorrect: boolean) => {
    setStudyProgress(prev => ({
      ...prev,
      [wordId]: calculateNextReview(prev[wordId] ?? null, wasCorrect)
    }))
  }

  const getDueWords = (words: VocabularyWord[]): VocabularyWord[] => {
    const now = new Date()
    return words.filter(word => {
      const progress = studyProgress[word.id]
      if (!progress) return true // New words are always due
      return new Date(progress.nextReview) <= now
    })
  }

  const getProgress = (wordId: number): StudyProgress | null => {
    return studyProgress[wordId] ?? null
  }

  const getStudyStats = () => {
    const now = new Date()
    const stats = {
      learning: 0,
      reviewing: 0,
      mastered: 0,
      dueToday: 0
    }

    Object.values(studyProgress).forEach(progress => {
      stats[progress.status]++
      if (new Date(progress.nextReview) <= now) {
        stats.dueToday++
      }
    })

    return stats
  }

  return {
    studyProgress,
    updateWordProgress,
    getDueWords,
    getProgress,
    getStudyStats
  }
}