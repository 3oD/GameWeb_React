import { Injectable, NotFoundException } from '@nestjs/common';

export type Game = {
  id: string;
  name: string;
  description?: string;
  url: string;
  active: boolean;
  iconUrl?: string;
  backendUrl?: string;
};

const GAMES: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'Klassiker zu zweit',
    url: 'http://localhost:4001',
    active: true,
  },
  {
    id: 'snake',
    name: 'Snake',
    description: 'Arcade Klassiker',
    url: 'http://localhost:4002',
    active: false,
  },
];

@Injectable()
export class GamesService {
  findAll(): Game[] {
    return GAMES;
  }
  findOne(id: string): Game {
    const g = GAMES.find((x) => x.id === id);
    if (!g) throw new NotFoundException('Game not found');
    return g;
  }
}
