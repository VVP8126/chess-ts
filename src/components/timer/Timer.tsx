import { FC, useEffect, useRef, useState } from "react";
import { Colors } from "../../models/colors/Color";
import { Player } from "../../models/player/Player";

interface TimerProps {
    currentPlayer: Player | null;
    restart: () => void;
}

const Timer:FC<TimerProps>  = ( { currentPlayer, restart } ) => {
    
    const [black, setBlack] = useState(300);
    const [white, setWhite] = useState(300);

    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(
        () => {
            startTimer();
        },
        [currentPlayer]
    );

    const startTimer = () => {
        if(timer.current) {
            clearInterval(timer.current);
        }
        const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
        timer.current = setInterval(callback, 1000);
    }

    const decrementBlackTimer = () => { setBlack(t => t - 1) }
    const decrementWhiteTimer = () => { setWhite(t => t - 1) }

    const handleRestart = () => {
        setBlack(300);
        setWhite(300);
        restart();
    }

    return (
        <div style={{width:"520px", display:"flex", justifyContent:"space-between"}}>
            <div><button onClick={handleRestart} >RESTART</button></div>
            <div><h5 style={{backgroundColor:"#555", color:"white"}}>BLACK:{black} / WHITE:{white}</h5></div>
        </div>
    );
}
export default Timer;
