import { games } from '@/config/games'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Games() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Spiele</h1>
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
