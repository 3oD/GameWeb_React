import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPost, getStoredToken, getStoredUser, storeToken, storeUser } from './api'

type User = {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  roles: string[]
}

type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [user, setUser] = useState<User | null>(() => getStoredUser<User>())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) refreshMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const res = await apiPost<{ accessToken: string; user: User }>('/auth/login', { email, password })
      setToken(res.accessToken)
      setUser(res.user)
      storeToken(res.accessToken)
      storeUser(res.user)
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    storeToken(null)
    storeUser(null)
  }

  async function refreshMe() {
    if (!token) return
    try {
      const me = await apiGet<User>('/auth/me', { token })
      setUser(me)
      storeUser(me)
    } catch {
      // token invalid
      logout()
    }
  }

  const value = useMemo<AuthContextType>(() => ({ user, token, loading, login, logout, refreshMe }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
