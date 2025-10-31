import { createContext, useContext, useState, useEffect, useMemo } from 'react'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Authentication context values memoized to prevent unnecessary re-renders
  const authValue = useMemo(() => ({
    user,
    login: async (email: string, password: string) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        
        if (!response.ok) throw new Error('Login failed')
        
        const userData = await response.json()
        setUser(userData)
        globalThis.localStorage.setItem('user', JSON.stringify(userData))
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    logout: () => {
      setUser(null)
      globalThis.localStorage.removeItem('user')
    },
    isLoading
  }), [user, isLoading])

  useEffect(() => {
    // Check if we're in browser environment
    if (globalThis?.window !== undefined) {
      const savedUser = globalThis.localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Error parsing saved user:', e)
          globalThis.localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with real API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const userData = await response.json()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}