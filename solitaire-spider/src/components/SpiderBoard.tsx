import React from 'react';
import { Card } from '../models/Card';
import CardComponent from './Card';

interface SpiderBoardProps {
  columns: Card[][];
  stock: Card[];
  completedSuits: Card[][];
  moveCard: (sourceColumnIndex: number, targetColumnIndex: number, cardIndex: number) => void;
  dealCards: () => void;
  cardBgColor: 'blue' | 'green' | 'red' | 'brown';
}

const SpiderBoard: React.FC<SpiderBoardProps> = ({
  columns,
  stock,
  moveCard,
  completedSuits,
  dealCards,
  cardBgColor,
}) => {
  const renderStockRows = () => {
    return Array.from({ length: Math.ceil(stock.length / 10) }).map((_, index) => (
      <div className="stock-row" key={index} onClick={dealCards}>
        <CardComponent
          card={null}
          cardIndex={index}
          columnIndex={0}
          moveCard={moveCard}
          columns={columns}
          cardBgColor={cardBgColor}
        />
      </div>
    ));
  };

  const renderCompletedSuitsRows = () => {
    const emptySuitRows = Array.from({ length: 8 - completedSuits.length }).map((_, index) => (
      <div className="completed-suit-row" key={`empty-${index}`}>
        <CardComponent
          card={null}
          cardIndex={index}
          columnIndex={0}
          moveCard={moveCard}
          columns={columns}
          isEmpty
          cardBgColor={cardBgColor}
        />
      </div>
    ));

    const suitRows = completedSuits.map((sequence, index) => (
      <div className="completed-suit-row" key={`completed-${index}`}>
        <CardComponent
          card={sequence[12]}
          cardIndex={0}
          columnIndex={0}
          moveCard={moveCard}
          columns={columns}
          cardBgColor={cardBgColor}
        />
      </div>
    ));

    return [...emptySuitRows, ...suitRows];
  };

  const renderColumns = () => {
    return columns.map((column, columnIndex) => (
      <div className="column" key={columnIndex}>
        {column.length === 0 ? (
          <CardComponent
            card={null}
            cardIndex={0}
            columnIndex={columnIndex}
            moveCard={moveCard}
            columns={columns}
            isEmpty
            cardBgColor={cardBgColor}
          />
        ) : (
          column.map((card, cardIndex) => (
            <CardComponent
              key={cardIndex}
              card={card}
              cardIndex={cardIndex}
              columnIndex={columnIndex}
              moveCard={moveCard}
              columns={columns}
              cardBgColor={cardBgColor}
            />
          ))
        )}
      </div>
    ));
  };

  return (
    <div className="spider-board">
      <div className="stock">
        <div className="stock-row-container">{renderStockRows()}</div>
        {renderCompletedSuitsRows()}
      </div>
      <div className="columns">{renderColumns()}</div>
    </div>
  );
};

export default SpiderBoard;
