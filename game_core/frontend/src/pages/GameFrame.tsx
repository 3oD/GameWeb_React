import { useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { games } from '../config/games'

export default function GameFrame() {
  const { id } = useParams<{ id: string }>()
  const game = useMemo(() => games.find((g) => g.id === id), [id])

  if (!game) return <Navigate to="/games" replace />
  if (!game.active) return <div>Spiel ist aktuell inaktiv.</div>

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{game.name}</h1>
        <a href={game.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">Im neuen Tab öffnen</a>
      </div>
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
        <iframe src={game.url} title={game.name} className="h-full w-full" />
      </div>
    </section>
  )
}
