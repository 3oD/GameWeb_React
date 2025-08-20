import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

type ThemeContextValue = {
  theme: Theme
  updateTheme: (t: Theme) => void
  resolved: 'light' | 'dark'
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

  // initialize from storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored) {
  setTheme(stored)
        applyTheme(stored)
        return
      }
    } catch {}
    applyTheme('system')
  }, [])

  const updateTheme = useCallback((t: Theme) => {
    setTheme(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {}
    applyTheme(t)
  }, [])

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
    () => ({ theme, updateTheme, resolved: theme === 'system' ? getSystemTheme() : theme }),
    [theme, updateTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
