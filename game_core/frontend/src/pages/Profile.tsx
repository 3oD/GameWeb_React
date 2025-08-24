import { useEffect } from 'react'
import { useAuthStore } from '@/stores'

export default function Profile() {
  const { user, fetchUser } = useAuthStore()
  useEffect(() => { if (!user) void fetchUser() }, [user, fetchUser])
  if (!user) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-4">
        <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        <p className="text-muted-foreground">Bitte anmelden…</p>
      </div>
    </div>
  )

  return (
    <section className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight relative group">
          <span className="bg-gradient-to-r from-blue-500 via-primary to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-400 group-hover:via-primary group-hover:to-purple-500">
            Mein Profil
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-primary/10 to-purple-600/10 rounded-lg blur-lg -z-10 opacity-50"></div>
        </h1>
        <p className="text-muted-foreground">
          Deine Gaming-Identität
        </p>
      </div>
      
      <div className="card-enhanced p-6 rounded-xl space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex gap-1">
              {user.roles.map(role => (
                <span key={role} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">📧</span>
              <span className="text-sm font-medium text-muted-foreground">E-Mail</span>
            </div>
            <p className="font-mono text-sm">{user.email}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🎭</span>
              <span className="text-sm font-medium text-muted-foreground">Rollen</span>
            </div>
            <p className="text-sm">{user.roles.join(', ')}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🌍</span>
              <span className="text-sm font-medium text-muted-foreground">Sprache</span>
            </div>
            <p className="text-sm">{user.settings.language || 'Nicht festgelegt'}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🎨</span>
              <span className="text-sm font-medium text-muted-foreground">Theme</span>
            </div>
            <p className="text-sm">{user.settings.theme || 'System'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
