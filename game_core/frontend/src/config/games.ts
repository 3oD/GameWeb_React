export type GameConfig = {
  id: string
  name: string
  description?: string
  url: string // frontend entry URL of the sub-service
  active: boolean
}

export const games: GameConfig[] = [
  { id: 'tictactoe', name: 'Tic Tac Toe', description: 'Klassiker zu zweit', url: 'http://localhost:4001', active: true },
  { id: 'snake', name: 'Snake', description: 'Arcade Klassiker', url: 'http://localhost:4002', active: false },
]
