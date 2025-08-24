// Export all Zustand stores from a central location
export { useAuthStore } from './authStore'
export { useThemeStore } from './themeStore'
export { useSettingsStore } from './settingsStore'

// Re-export types for convenience
export type { User } from './authStore'
export type { Theme } from './themeStore'
export type { GameCategory, Difficulty } from './settingsStore'
