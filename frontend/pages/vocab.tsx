import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/layout/Layout'
import VocabCard from '../components/VocabCard'
import SearchBar from '../components/vocab/SearchBar'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface VocabItem {
  id: number
  word: string
  reading: string
  meaning: string
  jlpt_level: string
}

export default function VocabPage() {
  const router = useRouter()
  const [vocab, setVocab] = useState<VocabItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState(router.query.level?.toString() || 'all')

  useEffect(() => {
    const fetchVocab = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
        const res = await fetch(`${apiUrl}/api/vocab`)
        const data = await res.json()
        setVocab(data)
        setLoading(false)
      } catch (err) {
        setError('Could not load vocabulary')
        setLoading(false)
      }
    }

    fetchVocab()
  }, [])

  const filteredVocab = useMemo(() => {
    return vocab.filter(item => {
      const matchesSearch = 
        searchQuery === '' ||
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesLevel = 
        selectedLevel === 'all' || 
        item.jlpt_level === selectedLevel

      return matchesSearch && matchesLevel
    })
  }, [vocab, searchQuery, selectedLevel])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Từ vựng JLPT
          </h1>
        </div>

        <SearchBar
          onSearch={setSearchQuery}
          onFilterLevel={setSelectedLevel}
          selectedLevel={selectedLevel}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVocab.map((item) => (
            <Link 
              key={item.id} 
              href={`/vocab/${item.id}`}
              className="transition-transform hover:scale-105"
            >
              <VocabCard
                word={item.word}
                reading={item.reading}
                meaning={item.meaning}
                jlptLevel={item.jlpt_level}
              />
            </Link>
          ))}
        </div>
        
        {filteredVocab.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No vocabulary found matching your criteria
          </div>
        )}
      </div>
    </Layout>
  )
}