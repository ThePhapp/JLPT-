import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center text-xl font-bold text-gray-800 dark:text-white"
            >
              JLPT Study
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/vocab" 
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              Từ vựng
            </Link>
            <Link 
              href="/grammar" 
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              Ngữ pháp
            </Link>
            <Link 
              href="/kanji" 
              className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md"
            >
              Kanji
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}