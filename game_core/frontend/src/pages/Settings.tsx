import { useEffect, useState } from 'react'
import { apiGet, apiPatch } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Settings = { language?: 'de' | 'en'; theme?: 'light' | 'dark' | 'system' }

export default function Settings() {
  const { token } = useAuth()
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    apiGet<Settings>('/users/me/settings', { token })
      .then(setSettings)
      .finally(() => setLoading(false))
  }, [token])

  async function save() {
    if (!token) return
    setLoading(true)
    try {
      const s = await apiPatch<Settings>('/users/me/settings', settings, { token })
      setSettings(s)
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <p>Bitte anmelden…</p>

  return (
    <section className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold tracking-tight">Einstellungen</h1>
      <div className="grid gap-3">
        <div className="grid gap-1">
          <Label htmlFor="language">{"Sprache"}</Label>
          <Select value={settings.language ?? 'de'} onValueChange={(v: string) => setSettings({ ...settings, language: v as Settings['language'] })}>
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">Englisch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="theme">{"Theme"}</Label>
          <Select value={settings.theme ?? 'system'} onValueChange={(v: string) => setSettings({ ...settings, theme: v as Settings['theme'] })}>
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Hell</SelectItem>
              <SelectItem value="dark">Dunkel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={save} disabled={loading}>{loading ? 'Speichern…' : 'Speichern'}</Button>
      </div>
    </section>
  )
}
