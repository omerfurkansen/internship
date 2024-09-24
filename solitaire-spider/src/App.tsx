import React from 'react';
import GameScreen from './components/GameScreen';
import DragDropContext from './contexts/DragDropContext';

function App() {
  return (
    <DragDropContext>
      <GameScreen />
    </DragDropContext>
  );
}

export default App;
