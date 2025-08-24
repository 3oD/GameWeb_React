import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiGet, apiPut } from '../lib/api'

export type GameCategory = 'all' | 'action' | 'puzzle' | 'strategy' | 'arcade'
export type Difficulty = 'easy' | 'medium' | 'hard'

type SettingsState = {
  notifications: boolean
  autoSave: boolean
  language: string
  gameCategory: GameCategory
  difficulty: Difficulty
  volume: number
  isLoading: boolean
  error: string | null
}

type SettingsActions = {
  updateSetting: <K extends keyof Omit<SettingsState, 'isLoading' | 'error'>>(
    key: K, 
    value: SettingsState[K]
  ) => void
  updateSettings: (settings: Partial<Omit<SettingsState, 'isLoading' | 'error'>>) => void
  loadSettings: () => Promise<void>
  saveSettings: () => Promise<void>
  resetSettings: () => void
  clearError: () => void
}

const defaultSettings: Omit<SettingsState, 'isLoading' | 'error'> = {
  notifications: true,
  autoSave: true,
  language: 'en',
  gameCategory: 'all',
  difficulty: 'medium',
  volume: 75,
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set, get) => ({
      // State
      ...defaultSettings,
      isLoading: false,
      error: null,

      // Actions
      updateSetting: (key, value) => {
        set({ [key]: value, error: null })
      },

      updateSettings: (settings) => {
        set({ ...settings, error: null })
      },

      loadSettings: async () => {
        try {
          set({ isLoading: true, error: null })
          
          // Get current auth token from auth store
          const token = (await import('./authStore')).useAuthStore.getState().token
          if (!token) {
            set({ isLoading: false, error: 'No authentication token' })
            return
          }
          
          // Try to load settings from backend
          const serverSettings = await apiGet<Omit<SettingsState, 'isLoading' | 'error'>>('/users/settings', { token })
          
          // Merge server settings with current state
          set({ 
            ...serverSettings,
            isLoading: false,
            error: null
          })
        } catch (error) {
          console.warn('Failed to load settings from server, using local settings:', error)
          set({ 
            isLoading: false, 
            error: 'Failed to sync settings from server'
          })
        }
      },

      saveSettings: async () => {
        try {
          set({ isLoading: true, error: null })
          
          const { isLoading, error, ...settingsToSave } = get()
          
          // Get current auth token from auth store
          const token = (await import('./authStore')).useAuthStore.getState().token
          if (!token) {
            set({ isLoading: false, error: 'No authentication token' })
            return
          }
          
          // Save to backend
          await apiPut('/users/settings', settingsToSave, { token })
          
          set({ 
            isLoading: false,
            error: null
          })
        } catch (error) {
          console.error('Failed to save settings to server:', error)
          set({ 
            isLoading: false, 
            error: 'Failed to save settings to server'
          })
        }
      },

      resetSettings: () => {
        set({ 
          ...defaultSettings,
          error: null
        })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist loading state or errors
      partialize: (state) => {
        const { isLoading, error, ...settingsToPersist } = state
        return settingsToPersist
      },
    }
  )
)
