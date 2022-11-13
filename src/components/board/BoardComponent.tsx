import React, { FC, useEffect, useState } from "react";
import { Board } from "../../models/board/Board";
import { Cell } from "../../models/board/Cell";
import { Player } from "../../models/player/Player";
import CellComponent from "../cell/CellComponent";
import BoardHeader from "./BoardHeader";

interface BoardProps {
    board: Board,
    setBoard: (board: Board) => void,
    currentPlayer: Player | null,
    swapPlayer: () => void,
    openStats: () => void
}

const BoardComponent:FC<BoardProps> = ( { board, setBoard, currentPlayer, swapPlayer, openStats } ) => {

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  
  useEffect(() => { highlightCells() }, [selectedCell]);

  const clickCell = (cell: Cell) => {
    if(selectedCell && selectedCell !== cell && selectedCell.figure?.isMoveble(cell)) {
      selectedCell.moveFigure(cell);
      swapPlayer();
      setSelectedCell(null);
      updateBoard();
    } else {
      if(cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  const highlightCells = () => {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  const updateBoard = () => {
    const newBoard = board.getBoardCopy();
    setBoard(newBoard);
  }

  return (
    <div>
      <BoardHeader currentPlayer={currentPlayer} openStats={openStats} />
      <div className="board">
        { board.cells.map(
            (row, index) => 
            <React.Fragment key={index}>
                { row.map(
                  cell => 
                  <CellComponent
                    clickCell={clickCell}
                    cell={cell}
                    key={cell.id}
                    selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y} />)
                }
            </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default BoardComponent;
