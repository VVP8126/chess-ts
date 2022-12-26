import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { Player } from "../../models/player/Player";
import QueenComponent from "../figures/QueenComponent";

interface BoardHeaderProps {
    currentPlayer: Player | null,
    openStats: () => void
}

const BoardHeader:FC<BoardHeaderProps> = ( {currentPlayer, openStats} ) => {
  return (
    <div className="boardHeader">
      <div className="spinnerBlock">
        <div className="lblPlayerMoveSize">&#8634;</div>
      </div>
      <div>
        <QueenComponent color={currentPlayer?.color === Colors.WHITE ? Colors.WHITE : Colors.BLACK} />
      </div>
      <div className="stats" onClick={openStats} title="Statistics">&#8801;</div>
    </div>
  );
}
export default BoardHeader;
