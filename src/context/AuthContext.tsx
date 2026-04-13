import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  email: string
  name: string
  domain: 'bandaholdings' | '5dm'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  loading: boolean
}

const ALLOWED_DOMAINS = ['5dm.africa', 'bandaholdings.com']
const SESSION_KEY = 'banda_dash_session'

const AuthContext = createContext<AuthContextType | null>(null)

function parseName(email: string): string {
  const local = email.split('@')[0]
  return local
    .replace(/[._-]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(SESSION_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const trimmed = email.trim().toLowerCase()
    const domain = trimmed.split('@')[1]

    if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
      return { error: 'Access restricted to @5dm.africa and @bandaholdings.com accounts.' }
    }

    if (!password || password.length < 4) {
      return { error: 'Please enter your password.' }
    }

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600))

    const newUser: User = {
      email: trimmed,
      name: parseName(trimmed),
      domain: domain === '5dm.africa' ? '5dm' : 'bandaholdings',
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
    setUser(newUser)
    return {}
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
