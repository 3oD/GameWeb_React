import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import React from 'react'

type Game = {
  id: string
  name: string
  description?: string
  url: string
  active: boolean
}

function useGames() {
  const [data, setData] = React.useState<Game[] | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  React.useEffect(() => {
    let mounted = true
    fetch('/api/games')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load games')
        return r.json()
      })
      .then((json) => {
        if (!mounted) return
        setData(json)
      })
      .catch((e) => {
        if (!mounted) return
        setError(e.message)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])
  return { data, loading, error }
}

export default function Games() {
  const { data, loading, error } = useGames()
  const games = data ?? []

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Spiele</h1>
      {loading && <p className="text-sm text-muted-foreground">Lade Spiele…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => (
          <Card key={g.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base">{g.name}</CardTitle>
                  {g.description && (
                    <p className="text-sm text-muted-foreground">{g.description}</p>
                  )}
                </div>
                <Badge variant={g.active ? 'default' : 'secondary'}>
                  {g.active ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-right">
              {g.active ? (
                <Link to={`/games/${g.id}`} className="text-sm text-primary hover:underline">Jetzt spielen</Link>
              ) : (
                <span className="text-sm text-muted-foreground">Nicht verfügbar</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
