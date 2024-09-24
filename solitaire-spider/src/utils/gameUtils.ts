import { Card, Suit, Rank } from '../models/Card';
import _ from 'lodash';

const createDeck = (suits: Suit[], ranks: Rank[]): Card[] => {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit,
      rank,
      isFaceUp: false,
    }))
  );
};

export const createInitialDeck = (numSuits: number): Card[] => {
  const allSuits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const selectedSuits: Suit[] = allSuits.slice(0, numSuits);
  const ranks: Rank[] = [
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '10', value: 10 },
    { label: 'J', value: 11 },
    { label: 'Q', value: 12 },
    { label: 'K', value: 13 },
    { label: 'A', value: 1 },
  ];

  const deck = createDeck(selectedSuits, ranks);
  const numSets = 104 / deck.length;
  const decks = Array.from({ length: numSets }, () => deck).flat();
  const shuffledDecks = _.shuffle(decks);
  return shuffledDecks;
};

export const isCompleteSequence = (cards: Card[]): boolean => {
  if (cards.length !== 13) return false;

  const suits = new Set(cards.map((card) => card.suit));
  if (suits.size !== 1) return false;

  let expectedValue = 13;
  for (const card of cards) {
    if (card.rank.value !== expectedValue) return false;
    expectedValue--;
  }

  return true;
};

export const isSequential = (cards: Card[]): boolean => {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].rank.value !== cards[i - 1].rank.value - 1) return false;
    if (cards[i].suit !== cards[i - 1].suit) return false;
  }

  return true;
};
