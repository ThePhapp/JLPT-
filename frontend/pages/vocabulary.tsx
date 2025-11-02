import { useState, useEffect } from 'react'
import ProtectedLayout from '../components/layout/ProtectedLayout'

interface VocabularyItem {
  id: number
  word: string
  kanji?: string
  hiragana?: string
  katakana?: string
  meanings: string[]
  examples: Array<{
    japanese: string
    english: string
  }>
  components?: Array<{
    kanji: string
    meaning: string
  }>
  jlpt_level: string
  tags: string[]
  stroke_count?: number
}

export default function VocabularyPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVocabulary()
  }, [searchTerm, selectedLevel])

  const fetchVocabulary = async () => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedLevel) params.append('level', selectedLevel)

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vocabulary?${params.toString()}`
      )
      if (!response.ok) throw new Error('Failed to fetch vocabulary')
      
      const data = await response.json()
      setVocabulary(data)
    } catch (error) {
      console.error('Error fetching vocabulary:', error)
    } finally {
      setLoading(false)
    }
  }

  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1']

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Vocabulary</h1>
          <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
            {/* Search Input */}
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search vocabulary..."
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="mt-2 sm:mt-0 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">All Levels</option>
              {jlptLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Vocabulary List */}
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vocabulary.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        {item.word}
                      </h3>
                      {item.kanji && (
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {item.kanji}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {item.jlpt_level}
                    </span>
                  </div>

                  {/* Meanings */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Meanings
                    </h4>
                    <ul className="mt-2 text-sm text-gray-900 dark:text-white">
                      {item.meanings.map((meaning, index) => (
                        <li key={index}>{meaning}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Examples */}
                  {item.examples.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Examples
                      </h4>
                      <ul className="mt-2 space-y-2">
                        {item.examples.map((example, index) => (
                          <li key={index} className="text-sm">
                            <p className="text-gray-900 dark:text-white">
                              {example.japanese}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {example.english}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Components */}
                  {item.components && item.components.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Kanji Components
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.components.map((component, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">
                              {component.kanji}
                            </span>
                            <span className="ml-1 text-gray-500 dark:text-gray-400">
                              {component.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}