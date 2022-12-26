import React, { FC } from "react";
import { Cell } from "../../models/board/Cell";
import { FigureNames } from "../../models/figures/names/FigureNames";
import BishopComponent from "../figures/BishopComponent";
import KingComponent from "../figures/KingComponent";
import KnightComponent from "../figures/KnightComponent";
import PawnComponent from "../figures/PawnComponent";
import QueenComponent from "../figures/QueenComponent";
import RookComponent from "../figures/RookComponent";

interface CellProps {
  cell: Cell;
  selected: boolean;
  clickCell: (cell: Cell) => void;
}

// setCheckToKing - not ready
const CellComponent:FC<CellProps> = ( { cell, selected, clickCell } ) => {

  const click = (cell: Cell) => {
    clickCell(cell);
  }

  return (
    <div  className={[`cell`, cell.color, (selected ? "selectedCell" : "")].join(" ")} 
          onClick={() => click(cell)} 
          style={{backgroundImage: cell.available && cell.figure ? "radial-gradient(circle, #eee 60%, transparent 5%, #222 35%)" : "" }} >
      
      { (cell.available && !cell.figure) && <div className="availableCell"></div> }
      { cell.figure?.name === FigureNames.BISHOP && <BishopComponent color={cell.figure?.color} /> }
      { cell.figure?.name === FigureNames.KING   && <KingComponent   color={cell.figure?.color} /> }
      { cell.figure?.name === FigureNames.QUEEN  && <QueenComponent  color={cell.figure?.color} /> }
      { cell.figure?.name === FigureNames.KNIGHT && <KnightComponent color={cell.figure?.color} /> }
      { cell.figure?.name === FigureNames.ROOK   && <RookComponent   color={cell.figure?.color} /> }
      { cell.figure?.name === FigureNames.PAWN   && <PawnComponent   color={cell.figure?.color} /> }
      { /**  `${cell.y};${cell.x}` */ }

    </div>
  );
}

export default CellComponent;
