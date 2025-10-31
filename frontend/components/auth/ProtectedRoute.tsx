import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirect=${router.asPath}`)
      } else if (adminOnly && !user.isAdmin) {
        router.push('/')
      }
    }
  }, [user, isLoading, router, adminOnly])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || (adminOnly && !user.isAdmin)) {
    return null
  }

  return <>{children}</>
}