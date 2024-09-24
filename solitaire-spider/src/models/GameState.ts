import { Card } from './Card';

export interface GameState {
  columns: Card[][];
  stock: Card[];
  completedSuits: Card[][];
  points: number;
  timer: number; // Timer in seconds
  level: 1 | 2 | 4; // Number of suits
  isPaused: boolean;
  gameOver: 'win' | 'lose' | null;
  cardBackgroundColor: 'blue' | 'green' | 'red' | 'brown';
}
