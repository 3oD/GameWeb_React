import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

type ThemeState = {
  theme: Theme
  resolved: 'light' | 'dark'
}

type ThemeActions = {
  updateTheme: (theme: Theme) => void
  initializeTheme: () => void
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set, get) => ({
      // State
      theme: 'system',
      resolved: 'light',

      // Actions
      updateTheme: (theme: Theme) => {
        set({ theme })
        
        // Update DOM immediately
        const root = document.documentElement
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          set({ resolved: systemTheme })
          root.classList.toggle('dark', systemTheme === 'dark')
        } else {
          set({ resolved: theme })
          root.classList.toggle('dark', theme === 'dark')
        }
      },

      initializeTheme: () => {
        const { theme } = get()
        const root = document.documentElement

        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          set({ resolved: systemTheme })
          root.classList.toggle('dark', systemTheme === 'dark')
        } else {
          set({ resolved: theme })
          root.classList.toggle('dark', theme === 'dark')
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = (e: MediaQueryListEvent) => {
          const { theme: currentTheme } = get()
          if (currentTheme === 'system') {
            const systemTheme = e.matches ? 'dark' : 'light'
            set({ resolved: systemTheme })
            root.classList.toggle('dark', systemTheme === 'dark')
          }
        }

        mediaQuery.addEventListener('change', handleChange)
        
        // Cleanup function (if needed in the future)
        return () => mediaQuery.removeEventListener('change', handleChange)
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the theme preference, not resolved value
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)
