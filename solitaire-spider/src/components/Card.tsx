import React from 'react';
import { Card as CardModel } from '../models/Card';
import { useDrag, useDrop } from 'react-dnd';
import { isSequential } from '../utils/gameUtils';
import cardImages from '../assets/card-images';

interface CardProps {
  card: CardModel | null;
  cardIndex: number;
  columnIndex: number;
  moveCard: (sourceColumnIndex: number, targetColumnIndex: number, cardIndex: number) => void;
  isEmpty?: boolean;
  columns: CardModel[][];
  cardBgColor: 'blue' | 'green' | 'red' | 'brown';
}

const Card: React.FC<CardProps> = ({ card, cardIndex, columnIndex, moveCard, isEmpty, columns, cardBgColor }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { card, cardIndex, columnIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: card?.isFaceUp && isSequential(columns[columnIndex].slice(cardIndex)),
  });

  const [, drop] = useDrop({
    accept: 'card',
    drop: (item: CardProps) => moveCard(item.columnIndex, columnIndex, item.cardIndex),
  });

  if (isDragging) {
    return <div style={{ height: 19 }} />;
  }

  const getCardImage = (): string => {
    const cardBackground = {
      blue: cardImages.backgroundBlue,
      green: cardImages.backgroundGreen,
      red: cardImages.backgroundRed,
      brown: cardImages.backgroundBrown,
    }[cardBgColor];

    if (!card) return cardBackground;

    if (card.isFaceUp) {
      const { suit, rank } = card;
      const suitMap: Record<string, string> = {
        clubs: 'Club',
        diamonds: 'Diamond',
        hearts: 'Heart',
        spades: 'Spade',
      };

      const suitKey = suitMap[suit];
      return cardImages[`card${rank.label}${suitKey}`] || cardBackground;
    }

    return cardBackground;
  };

  return (
    <div ref={(node) => drag(drop(node))} className={`card ${cardIndex === 0 ? 'first' : ''}`}>
      {isEmpty ? (
        <div
          style={{
            height: 'inherit',
            border: '5px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            backgroundColor: 'transparent',
          }}
        />
      ) : (
        <img
          src={getCardImage()}
          alt={`Card ${cardIndex}-${columnIndex}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default Card;
