import { useState } from 'react'
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition'
import { VocabularyWord } from '@/types/vocabulary'
import AudioButton from '@/components/vocab/AudioButton'

interface FlashcardProps {
  word: VocabularyWord
  onNext: () => void
}

export default function Flashcard({ word, onNext }: Readonly<FlashcardProps>) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { updateWordProgress } = useSpacedRepetition()

  const handleKnow = () => {
    updateWordProgress(word.id, true)
    onNext()
    setIsFlipped(false)
  }

  const handleDontKnow = () => {
    updateWordProgress(word.id, false)
    onNext()
    setIsFlipped(false)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="aspect-[4/3] relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Front */}
        <div 
          className={`absolute inset-0 p-6 transition-all duration-700 ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-4xl mb-4 font-bold text-gray-900 dark:text-white">
              {word.kanji || word.word}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              {word.hiragana}
            </p>
            <AudioButton word={word.word} />
          </div>
        </div>

        {/* Back */}
        <div 
          className={`absolute inset-0 p-6 transition-all duration-700 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="h-full overflow-y-auto">
            {word.meanings.map((meaning, i) => (
              <div key={`meaning-${word.id}-${i}`} className="mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {meaning.type}
                </div>
                <div className="text-lg text-gray-900 dark:text-white">
                  {meaning.definition}
                </div>
                {meaning.tags && meaning.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {meaning.tags.map((tag) => (
                      <span 
                        key={`tag-${word.id}-${i}-${tag}`}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {word.examples.length > 0 && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Ví dụ:
                </h3>
                {word.examples.map((example, i) => (
                  <div key={`example-${word.id}-${i}`} className="mb-3">
                    <p className="text-lg text-gray-900 dark:text-white">
                      {example.japanese}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {example.reading}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {example.meaning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleDontKnow}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Không biết
        </button>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isFlipped ? 'Ẩn nghĩa' : 'Xem nghĩa'}
        </button>
        <button
          onClick={handleKnow}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Biết
        </button>
      </div>
    </div>
  )
}