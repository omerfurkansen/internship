import React from 'react';
import useGameLogic from '../hooks/useGameLogic';
import SpiderBoard from './SpiderBoard';

const GameScreen: React.FC = () => {
  const {
    gameState,
    startGame,
    dealCards,
    moveCard,
    setDifficulty,
    setBgColor,
  } = useGameLogic();

  React.useEffect(() => {
    if (gameState.columns.every(column => column.length === 0)) {
      startGame();
    }
  }, [gameState.columns, startGame]);

  const handleDifficultyChange = (suits: 1 | 2 | 4) => () => setDifficulty(suits);
  const handleBgColorChange = (color: 'blue' | 'green' | 'red' | 'brown') => () => setBgColor(color);

  return (
    <div className="game-screen">
      <SpiderBoard
        columns={gameState.columns}
        stock={gameState.stock}
        moveCard={moveCard}
        completedSuits={gameState.completedSuits}
        dealCards={dealCards}
        cardBgColor={gameState.cardBackgroundColor}
      />
      <div className="game-controls" style={controlsStyle}>
        <button onClick={handleDifficultyChange(1)}>1 Suit</button>
        <button onClick={handleDifficultyChange(2)}>2 Suits</button>
        <button onClick={handleDifficultyChange(4)}>4 Suits</button>
        <button onClick={handleBgColorChange('blue')}>Blue Background</button>
        <button onClick={handleBgColorChange('green')}>Green Background</button>
        <button onClick={handleBgColorChange('red')}>Red Background</button>
        <button onClick={handleBgColorChange('brown')}>Brown Background</button>
      </div>
    </div>
  );
};

const controlsStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  padding: 20,
  gap: 10,
  display: 'flex',
};

export default GameScreen;
