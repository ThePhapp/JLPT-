import { useRouter } from 'next/router'
import Layout from '../components/layout/Layout'
import { useAuth } from '../contexts/AuthContext'
import RegisterForm from '../components/auth/RegisterForm'

export default function RegisterPage() {
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    router.push('/')
    return null
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Đăng ký tài khoản mới
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Đã có tài khoản?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Đăng nhập
              </a>
            </p>
          </div>
          <RegisterForm
            onSuccess={() => {
              router.push('/login')
            }}
          />
        </div>
      </div>
    </Layout>
  )
}