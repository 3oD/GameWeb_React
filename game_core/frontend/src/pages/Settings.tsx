import { useEffect } from 'react'
import { useAuthStore, useThemeStore, useSettingsStore } from '@/stores'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Settings() {
  const { user, token } = useAuthStore()
  const { theme, updateTheme } = useThemeStore()
  const { 
    language, 
    notifications, 
    autoSave, 
    gameCategory, 
    difficulty, 
    volume, 
    isLoading, 
    error,
    updateSetting, 
    loadSettings, 
    saveSettings, 
    clearError 
  } = useSettingsStore()

  useEffect(() => {
    if (user && token) {
      loadSettings()
    }
  }, [user, token, loadSettings])

  // Sync theme setting with theme store
  useEffect(() => {
    if (theme) {
      updateSetting('gameCategory', gameCategory) // Maintain other settings
    }
  }, [theme])

  function handleThemeChange(newTheme: string) {
    updateTheme(newTheme as 'light' | 'dark' | 'system')
  }

  async function handleSave() {
    try {
      await saveSettings()
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  if (!user) return <p>Bitte anmelden…</p>

  return (
    <section className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight relative group">
          <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-400 group-hover:via-primary group-hover:to-purple-500">
            Einstellungen
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-primary/10 to-purple-600/10 rounded-lg blur-lg -z-10 opacity-50"></div>
        </h1>
        <p className="text-muted-foreground">
          Personalisiere deine Gaming-Erfahrung
        </p>
      </div>
      
      {error && (
        <div className="card-enhanced p-4 rounded-xl bg-destructive/15 border border-destructive/20 text-destructive">
          <div className="flex justify-between items-center">
            <span className="font-medium">{error}</span>
            <Button variant="ghost" size="sm" onClick={clearError}>✕</Button>
          </div>
        </div>
      )}
      
      <div className="card-enhanced p-6 rounded-xl space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium">Sprache</Label>
            <Select value={language} onValueChange={(v: string) => updateSetting('language', v)}>
              <SelectTrigger id="language" className="input-enhanced">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                <SelectItem value="en">🇺🇸 Englisch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme" className="text-sm font-medium">Theme</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme" className="input-enhanced">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">🖥️ System</SelectItem>
                <SelectItem value="light">☀️ Hell</SelectItem>
                <SelectItem value="dark">🌙 Dunkel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gameCategory" className="text-sm font-medium">Spiel-Kategorie</Label>
            <Select value={gameCategory} onValueChange={(v: string) => updateSetting('gameCategory', v as typeof gameCategory)}>
              <SelectTrigger id="gameCategory" className="input-enhanced">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🎮 Alle</SelectItem>
                <SelectItem value="action">⚡ Action</SelectItem>
                <SelectItem value="puzzle">🧩 Puzzle</SelectItem>
                <SelectItem value="strategy">🧠 Strategie</SelectItem>
                <SelectItem value="arcade">🕹️ Arcade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-medium">Schwierigkeit</Label>
            <Select value={difficulty} onValueChange={(v: string) => updateSetting('difficulty', v as typeof difficulty)}>
              <SelectTrigger id="difficulty" className="input-enhanced">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">😊 Einfach</SelectItem>
                <SelectItem value="medium">😐 Mittel</SelectItem>
                <SelectItem value="hard">😤 Schwer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="volume" className="text-sm font-medium">Lautstärke</Label>
            <div className="space-y-2">
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
                style={{
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${volume}%, hsl(var(--muted)) ${volume}%, hsl(var(--muted)) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-foreground">{volume}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">🔔</span>
                <label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
                  Benachrichtigungen aktivieren
                </label>
              </div>
              <input
                id="notifications"
                type="checkbox"
                checked={notifications}
                onChange={(e) => updateSetting('notifications', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-lg">💾</span>
                <label htmlFor="autoSave" className="text-sm font-medium cursor-pointer">
                  Automatisch speichern
                </label>
              </div>
              <input
                id="autoSave"
                type="checkbox"
                checked={autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="w-4 h-4 text-primary rounded focus:ring-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="btn-enhanced px-8"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Speichern…
              </>
            ) : (
              <>
                💾 Speichern
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
