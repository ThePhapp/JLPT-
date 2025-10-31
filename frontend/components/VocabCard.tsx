interface VocabCardProps {
  word: string
  reading: string
  meaning: string
  jlptLevel: string
}

export default function VocabCard({ word, reading, meaning, jlptLevel }: VocabCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {word}
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {reading}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {jlptLevel}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          {meaning}
        </p>
      </div>
    </div>
  )
}