import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiPost, apiGet } from '../lib/api'

export type User = {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  roles: string[]
  settings: { language?: string; theme?: 'light' | 'dark' | 'system' }
}

type AuthState = {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

type AuthActions = {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
  clearError: () => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await apiPost<{ token: string; user: User }>('/auth/login', {
            email,
            password
          })
          
          set({ 
            token: response.token, 
            user: response.user, 
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          })
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null })
      },

      fetchUser: async () => {
        const { token } = get()
        if (!token) {
          set({ isInitialized: true })
          return
        }

        set({ isLoading: true, error: null })
        try {
          const user = await apiGet<User>('/auth/me', { token })
          set({ user, isLoading: false, isInitialized: true })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user', 
            isLoading: false,
            isInitialized: true
          })
          // If token is invalid, logout
          if (error instanceof Error && error.message.includes('401')) {
            get().logout()
          }
        }
      },

      initialize: async () => {
        const { token, isInitialized } = get()
        if (isInitialized) return
        
        if (token) {
          await get().fetchUser()
        } else {
          set({ isInitialized: true })
        }
      },

      setUser: (user: User | null) => {
        set({ user })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist token and user, not loading/error states
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user 
      }),
    }
  )
)
