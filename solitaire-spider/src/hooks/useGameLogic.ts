import { useState } from 'react';
import { createInitialDeck, isCompleteSequence } from '../utils/gameUtils';
import { GameState } from '../models/GameState';
import { Card } from '../models/Card';

const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    columns: Array.from({ length: 10 }, () => []),
    stock: [],
    completedSuits: [],
    points: 0,
    timer: 0,
    level: 1, // Default to 1 suit
    isPaused: false,
    gameOver: null,
    cardBackgroundColor: 'blue',
  });

  const startGame = () => {
    const initialDeck = createInitialDeck(gameState.level);
    const columns: Array<typeof initialDeck> = Array.from({ length: 10 }, () => []);
    for (let i = 0; i < 10; i++) {
      const isFirst4Columns = i < 4;
      const numCards = isFirst4Columns ? 6 : 5;
      for (let j = 0; j < numCards; j++) {
        columns[i].push({
          ...initialDeck.pop()!,
          isFaceUp: j === numCards - 1,
        });
      }
    }
    setGameState((gameState) => ({
      ...gameState,
      columns,
      stock: initialDeck,
      completedSuits: [],
      points: 0,
      timer: 0,
      gameOver: null,
    }));
  };

  const dealCards = () => {
    if (gameState.stock.length === 0 || gameState.columns.some((column) => column.length === 0)) {
      return;
    }
    const newStock = [...gameState.stock];
    const newColumns = gameState.columns.map((column) => [...column]);

    newColumns.forEach((column) => {
      if (newStock.length > 0) {
        const card = newStock.pop()!;
        card.isFaceUp = true;
        column.push(card);
      }
    });

    setGameState({
      ...gameState,
      columns: newColumns,
      stock: newStock,
    });
  };

  const flipCard = (columnIndex: number, cardIndex: number) => {
    const newColumns = gameState.columns.map((column) => [...column]);
    newColumns[columnIndex][cardIndex].isFaceUp = !newColumns[columnIndex][cardIndex].isFaceUp;
    setGameState({
      ...gameState,
      columns: newColumns,
    });
  };

  const moveCard = (sourceColumnIndex: number, targetColumnIndex: number, cardIndex: number) => {
    const sourceColumn = gameState.columns[sourceColumnIndex];
    const targetColumn = gameState.columns[targetColumnIndex];

    const cardToMove = sourceColumn[cardIndex];
    const sequenceToMove = sourceColumn.slice(cardIndex);
    const targetCard = targetColumn[targetColumn.length - 1];
    const canMove = targetCard ? targetCard.rank.value === cardToMove.rank.value + 1 : targetColumn.length === 0;

    if (canMove) {
      const newColumns = gameState.columns.map((column) => [...column]);
      newColumns[targetColumnIndex] = [...targetColumn, ...sequenceToMove];
      newColumns[sourceColumnIndex] = sourceColumn.slice(0, cardIndex);

      const newSourceColumn = newColumns[sourceColumnIndex];
      if (newSourceColumn.length > 0) {
        newSourceColumn[newSourceColumn.length - 1].isFaceUp = true;
      }

      const completedSequences: Card[][] = [];
      const updatedTargetColumn = newColumns[targetColumnIndex];

      while (updatedTargetColumn.length >= 13) {
        const sequence = updatedTargetColumn.slice(-13);
        if (isCompleteSequence(sequence)) {
          completedSequences.push(sequence);
          updatedTargetColumn.splice(-13);
          if (updatedTargetColumn.length > 0) {
            updatedTargetColumn[updatedTargetColumn.length - 1].isFaceUp = true;
          }
        } else {
          break;
        }
      }

      setGameState({
        ...gameState,
        columns: newColumns,
        completedSuits: [...gameState.completedSuits, ...completedSequences],
      });
    }
  };

  const setDifficulty = (level: 1 | 2 | 4) => {
    setGameState({
      ...gameState,
      columns: Array.from({ length: 10 }, () => []),
      stock: [],
      completedSuits: [],
      level,
    });
  };

  const setBgColor = (color: 'blue' | 'green' | 'red' | 'brown') => {
    setGameState({
      ...gameState,
      cardBackgroundColor: color,
    });
  };

  return {
    gameState,
    startGame,
    dealCards,
    flipCard,
    moveCard,
    setDifficulty,
    setBgColor,
  };
};

export default useGameLogic;
