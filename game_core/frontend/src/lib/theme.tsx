import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  theme: Theme
  updateTheme: (t: Theme) => void
  resolved: 'light' | 'dark'
  syncFromUserSettings: (userTheme?: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const mode = theme === 'system' ? getSystemTheme() : theme
  root.classList.toggle('dark', mode === 'dark')
}

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = React.useState<Theme>('system')
  const [initialized, setInitialized] = React.useState(false)

  // initialize from storage on mount
  useEffect(() => {
    if (initialized) return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored) {
        setTheme(stored)
        applyTheme(stored)
        setInitialized(true)
        return
      }
    } catch {}
    
    // If no stored theme, check if we can get it from user settings
    // This will be handled by the Settings page or auth flow
    applyTheme('system')
    setInitialized(true)
  }, [initialized])

  const updateTheme = useCallback((t: Theme) => {
    setTheme(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {}
    applyTheme(t)
  }, [])

  const syncFromUserSettings = useCallback((userTheme?: Theme) => {
    if (!userTheme) return
    // Only sync if different from current theme
    if (userTheme !== theme) {
      setTheme(userTheme)
      try {
        localStorage.setItem(STORAGE_KEY, userTheme)
      } catch {}
      applyTheme(userTheme)
    }
  }, [theme])

  // Apply on mount and subscribe to system changes when on system
  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [theme])

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
  setTheme(e.newValue as Theme)
        applyTheme(e.newValue as Theme)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, updateTheme, resolved: theme === 'system' ? getSystemTheme() : theme, syncFromUserSettings }),
    [theme, updateTheme, syncFromUserSettings]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
