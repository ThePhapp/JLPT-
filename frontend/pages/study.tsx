import { useState, useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Flashcard from '@/components/study/Flashcard'

interface VocabItem {
  id: number
  word: string
  reading: string
  meaning: string
  jlpt_level: string
}

export default function StudyPage() {
  const [vocab, setVocab] = useState<VocabItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
        const res = await fetch(`${apiUrl}/api/vocab`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await res.json()
        setVocab(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching vocab:', err)
        setLoading(false)
      }
    }

    fetchVocab()
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % vocab.length)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (!vocab.length) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500 dark:text-gray-400">No vocabulary available</p>
        </div>
      </Layout>
    )
  }

  const currentWord = vocab[currentIndex]

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Study Flashcards</h1>
          <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {vocab.length}
          </div>
          <Flashcard
            id={currentWord.id}
            word={currentWord.word}
            reading={currentWord.reading}
            meaning={currentWord.meaning}
            onNext={handleNext}
          />
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Click card to flip • Listen to pronunciation • Track your progress
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}