import { useState } from 'react'

interface SearchBarProps {
  readonly onSearch: (query: string) => void
  readonly onFilterLevel: (level: string) => void
  readonly selectedLevel: string
}

export default function SearchBar({ onSearch, onFilterLevel, selectedLevel }: Readonly<SearchBarProps>) {
  const [searchQuery, setSearchQuery] = useState('')
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm từ vựng..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={selectedLevel}
        onChange={(e) => onFilterLevel(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">Tất cả</option>
        <option value="N5">N5</option>
        <option value="N4">N4</option>
        <option value="N3">N3</option>
        <option value="N2">N2</option>
        <option value="N1">N1</option>
      </select>
    </div>
  )
}