import React, { useEffect, useState } from 'react';
import BoardComponent from './components/board/BoardComponent';
import LostFiguresComponent from './components/looses/LostFiguresComponent';
import Timer from './components/timer/Timer';
import { Board } from './models/board/Board';
import { Colors } from './models/colors/Color';
import { Player } from './models/player/Player';
import './styles/styles.css';

function App() {
  
  const [board, setBoard] = useState(new Board());

  const [whitePlayer, setWhitePlayer] = useState<Player | null>(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState<Player | null>(new Player(Colors.BLACK));
  const [curntPlayer, setCurntPlayer] = useState<Player | null>(null);

  const [isLossesVisible, setIsLossesVisible] = useState(false);

  useEffect(
    () => {
      restart();
      setCurntPlayer(whitePlayer);
    },
    []
  );
  
  const swapPlayer = () => {
    setCurntPlayer(curntPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
  }

  const restart = () => {
    const b = new Board();
    b.initCells();
    b.arrangeChessboard();
    setBoard(b);
  }

  const closeLossesBlock = () => {
    setIsLossesVisible(false);
  }
  const openLossesBlock = () => {
    setIsLossesVisible(true);
  }

  return (
    <div className="boardLayout">
      <Timer restart={restart} currentPlayer={curntPlayer} />
      <BoardComponent board={board} setBoard={setBoard} currentPlayer={curntPlayer} swapPlayer={swapPlayer} openStats={openLossesBlock} />
      <div className='lostFiguresLayout'>
        <div className={["lost", isLossesVisible ? "visible": "invisible"].join(" ")}>
          <div className="lostCloseBtn" onClick={closeLossesBlock}>&times;</div>
          <LostFiguresComponent title='BLACK LOSSES' figures={board.lostBlackFigures} />
          <LostFiguresComponent title='WHITE LOSSES' figures={board.lostWhiteFigures} />
        </div>
      </div>
    </div>
  );
}

export default App;
