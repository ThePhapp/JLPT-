import Layout from '../components/layout/Layout'

export default function Home() {
  return (
    <Layout>
      <div className="prose dark:prose-invert lg:prose-xl mx-auto">
        <h1>Ứng dụng học tiếng Nhật JLPT</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {/* N5 Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">N5</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Cấp độ cơ bản nhất. Hiểu và sử dụng tiếng Nhật đơn giản.
            </p>
            <a href="/vocab?level=N5" className="mt-4 inline-block text-blue-500 hover:underline">
              Xem từ vựng N5 →
            </a>
          </div>

          {/* N4 Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">N4</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Hiểu tiếng Nhật cơ bản và áp dụng trong đời sống hàng ngày.
            </p>
            <a href="/vocab?level=N4" className="mt-4 inline-block text-green-500 hover:underline">
              Xem từ vựng N4 →
            </a>
          </div>

          {/* N3 Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">N3</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Hiểu tiếng Nhật được sử dụng trong các tình huống đời thường.
            </p>
            <a href="/vocab?level=N3" className="mt-4 inline-block text-yellow-500 hover:underline">
              Xem từ vựng N3 →
            </a>
          </div>
        </div>

        <div className="mt-12">
          <h2>Tính năng</h2>
          <ul>
            <li>Học và ôn tập từ vựng theo cấp độ JLPT (N5 → N1)</li>
            <li>Ngữ pháp và ví dụ thực tế</li>
            <li>Luyện tập Kanji và cách viết</li>
            <li>Theo dõi tiến độ học tập</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
