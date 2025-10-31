import { useState } from 'react'
import { useStudyProgress } from '@/hooks/useStudyProgress'
import AudioButton from '@/components/vocab/AudioButton'

interface FlashcardProps {
  id: number
  word: string
  reading: string
  meaning: string
  onNext: () => void
}

export default function Flashcard({ id, word, reading, meaning, onNext }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { markWordAsKnown, updateStudyStreak } = useStudyProgress()

  const handleKnow = () => {
    markWordAsKnown(id)
    updateStudyStreak()
    onNext()
    setIsFlipped(false)
  }

  const handleDontKnow = () => {
    onNext()
    setIsFlipped(false)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div 
        className={`relative h-64 cursor-pointer transition-transform duration-700 transform-gpu ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div className={`absolute inset-0 ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}>
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
            <div className="text-4xl mb-4">{word}</div>
            <AudioButton word={word} />
          </div>
        </div>

        {/* Back */}
        <div className={`absolute inset-0 ${isFlipped ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
          <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-xl mb-2">{reading}</div>
            <div className="text-gray-600 dark:text-gray-300">{meaning}</div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-6 flex space-x-4 justify-center">
          <button
            onClick={handleDontKnow}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Don't Know
          </button>
          <button
            onClick={handleKnow}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Know
          </button>
        </div>
      )}
    </div>
  )
}