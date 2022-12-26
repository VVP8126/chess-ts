import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { Player } from "../../models/player/Player";
import KingComponent from "../figures/KingComponent";

interface GameStatusInformationBlockProps {
    info: string;
    gameResult: string;
    currentPlayer: Player | null;
    setDialog: (param: boolean) => void;
}

const GameStatusInformationBlock:FC<GameStatusInformationBlockProps> = 
        ({info, gameResult, currentPlayer, setDialog}) => {
  return (
    <div className="gameStatusInformationBlock">
      <p>{info}</p>
      <KingComponent color={currentPlayer?.color === Colors.WHITE ? Colors.WHITE :Colors.BLACK } />
      <p>{ gameResult }</p>
      <br />
      <button className="gameStatusInformationBlockButton" 
              onClick={() => { setDialog(false) }}>
        OK
      </button>
    </div>
  );
}
export default GameStatusInformationBlock;
