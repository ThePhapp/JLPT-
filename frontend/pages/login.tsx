import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { redirect } = router.query

  if (user) {
    router.push(typeof redirect === 'string' ? redirect : '/')
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Sign in to your account
            </h2>
          </div>
          <LoginForm 
            onSuccess={() => {
              const redirectPath = typeof redirect === 'string' ? redirect : '/'
              router.push(redirectPath)
            }}
          />
        </div>
      </div>
    </Layout>
  )
}