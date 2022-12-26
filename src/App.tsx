import React, { useEffect, useState } from 'react';
import BoardComponent from './components/board/BoardComponent';
import GameStatusInformationBlock from './components/info/GameStatusInformationBlock';
import LostFiguresComponent from './components/looses/LostFiguresComponent';
import Timer from './components/timer/Timer';
import usePlayer from './hooks/usePlayer';
import { Board } from './models/board/Board';
import { Colors } from './models/colors/Color';
import { Player } from './models/player/Player';
import './styles/styles.css';

function App() {
  
  const [board, setBoard] = useState(new Board());
  
  // Original example:
  // const [whitePlayer, setWhitePlayer] = useState<Player | null>(new Player(Colors.WHITE)); // Bad practice - setWhitePlayer isn't used
  // const [blackPlayer, setBlackPlayer] = useState<Player | null>(new Player(Colors.BLACK)); // Bad practice - setBlackPlayer isn't used
  // const [curntPlayer, setCurntPlayer] = useState<Player | null>(null);

  const whitePlayer = usePlayer(new Player(Colors.WHITE));
  const blackPlayer = usePlayer(new Player(Colors.BLACK));
  const {player, setPlayer} = usePlayer(null);
  const [timeLooser, setTimeLooser] = useState<Colors | null>(null);
  const [timeoutResult, setTimeoutResult] = useState(false);
  const [isLossesVisible, setIsLossesVisible] = useState(false);

  useEffect( () => { restart() }, [] );
  
  const swapPlayer = () => {
    // setCurntPlayer(curntPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
    setPlayer(player?.color === Colors.WHITE ? blackPlayer.player : whitePlayer.player);
  }

  const restart = () => {
    const b = new Board();
    setIsLossesVisible(false);
    b.initCells();
    b.arrangeChessboard(); // standard chessboard arrangement
    // b.setPosition(); // custom chessboard arrangement
    setBoard(b);
    setPlayer(whitePlayer.player);
    // setCurntPlayer(whitePlayer);
  }

  const closeLossesBlock = () => {
    setIsLossesVisible(false);
  }
  const openLossesBlock = () => {
    setIsLossesVisible(true);
  }

  return (
    <div className="boardLayout">
      <Timer restart={restart} currentPlayer={player} setTimeoutResult={setTimeoutResult} setTimeLooser={setTimeLooser} />
      <BoardComponent board={board} setBoard={setBoard} currentPlayer={player} swapPlayer={swapPlayer} openStats={openLossesBlock} timeoutResult={timeoutResult} setTimeoutResult={setTimeoutResult} timeLooser={timeLooser} />
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
