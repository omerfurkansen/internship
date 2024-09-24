export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type RankLabel = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type RankValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Rank = {
  label: RankLabel;
  value: RankValue;
};

export interface Card {
  suit: Suit;
  rank: Rank;
  isFaceUp: boolean;
}
