import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import AudioButton from '../../components/vocab/AudioButton'

interface VocabDetail {
  id: number
  word: string
  reading: string
  meaning: string
  jlpt_level: string
  examples?: {
    japanese: string
    reading: string
    meaning: string
  }[]
}

export default function VocabDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [vocab, setVocab] = useState<VocabDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchVocabDetail = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
        const res = await fetch(`${apiUrl}/api/vocab/${id}`)
        if (!res.ok) throw new Error('Failed to fetch vocab details')
        const data = await res.json()
        setVocab(data)
      } catch (err) {
        setError('Could not load vocabulary details')
      } finally {
        setLoading(false)
      }
    }

    fetchVocabDetail()
  }, [id])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (error || !vocab) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Vocabulary not found'}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {vocab.word}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  {vocab.reading}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <AudioButton word={vocab.word} />
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {vocab.jlpt_level}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Meaning
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {vocab.meaning}
              </p>
            </div>

            {vocab.examples && vocab.examples.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Examples
                </h2>
                <div className="space-y-4">
                  {vocab.examples.map((example, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        {example.japanese}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {example.reading}
                      </p>
                      <p className="text-gray-700 dark:text-gray-400">
                        {example.meaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}