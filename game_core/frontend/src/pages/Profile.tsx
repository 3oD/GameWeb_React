import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function Profile() {
  const { user, refreshMe } = useAuth()
  useEffect(() => { if (!user) void refreshMe() }, [])
  if (!user) return <p>Bitte anmelden…</p>
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
      <div className="space-y-1">
        <p><span className="text-slate-500 dark:text-slate-400">Name:</span> {user.displayName}</p>
        <p><span className="text-slate-500 dark:text-slate-400">E-Mail:</span> {user.email}</p>
        <p><span className="text-slate-500 dark:text-slate-400">Rollen:</span> {user.roles.join(', ')}</p>
      </div>
    </section>
  )
}
