import { FC, useEffect, useRef, useState } from "react";
import { Colors } from "../../models/colors/Color";
import { Player } from "../../models/player/Player";

interface TimerProps {
  currentPlayer: Player | null;
  setTimeoutResult: (param: boolean) => void;
  setTimeLooser: (color: Colors | null) => void;
  restart: () => void;
}

const Timer:FC<TimerProps>  = ( { currentPlayer, restart, setTimeoutResult, setTimeLooser } ) => {
  
  const [black, setBlack] = useState(300);
  const [white, setWhite] = useState(300);

  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect( () => { startTimer() }, [currentPlayer] );

  const startTimer = () => {
    if(timer.current) {
      clearInterval(timer.current);
    }
    const callback = (black < 0 || white < 0) ? 
                      handleRestart:
                      (currentPlayer?.color === Colors.WHITE) ? 
                          decrementWhiteTimer:
                          decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
  }

  const updateTimer = (duration: number) => {
    setBlack(duration);
    setWhite(duration);
  }

  const decrementBlackTimer = () => { 
    setBlack(t => t - 1);
  }
  const decrementWhiteTimer = () => {
    setWhite(t => t - 1);
  }

  const handleRestart = () => {
    if(black < 0) {
      setTimeLooser(Colors.BLACK);
    }
    if(white < 0) {
      setTimeLooser(Colors.WHITE);
    }
    if(timer.current) {
      clearInterval(timer.current);
    }
    setTimeoutResult(true);
    updateTimer(300);
    restart();
  }

  return (
    <div className="timerBlock">
      <div><button className="restartGameButton" onClick={handleRestart} >RESTART</button></div>
      <div className="timerBoard">
        <div className="blackTimerDisplay">
          <h5>WHITE:{white}</h5>
        </div>
        <div className="whiteTimerDisplay">
          <h5>BLACK:{black}</h5>
        </div>
      </div>
    </div>
  );
}
export default Timer;
