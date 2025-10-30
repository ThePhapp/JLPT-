import { useEffect, useState } from 'react'

export default function Home() {
  const [status, setStatus] = useState<string>('loading')

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
    fetch(`${apiUrl}/api/health`)
      .then((r) => r.json())
      .then((j) => setStatus(j.status ?? 'unknown'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">JLPT Study App</h1>
        <p>Backend status: <strong>{status}</strong></p>
      </div>
    </main>
  )
}
