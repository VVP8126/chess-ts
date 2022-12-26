import React, { FC, useEffect, useState } from "react";
import useCheckToKing from "../../hooks/useCheckToKing";
import { Board } from "../../models/board/Board";
import { Cell } from "../../models/board/Cell";
import { Colors } from "../../models/colors/Color";
import { FigureNames } from "../../models/figures/names/FigureNames";
import { Player } from "../../models/player/Player";
import CellComponent from "../cell/CellComponent";
import GameStatusInformationBlock from "../info/GameStatusInformationBlock";
import TransformSelection from "../transformer/TransformSelection";
import BoardHeader from "./BoardHeader";

interface BoardProps {
    board: Board;
    setBoard: (board: Board) => void;
    currentPlayer: Player | null;
    swapPlayer: () => void;
    openStats: () => void;
    timeoutResult: boolean;
    setTimeoutResult: (val: boolean) => void;
    timeLooser: Colors | null;
}

const BoardComponent:FC<BoardProps> = ( { board, setBoard, currentPlayer, swapPlayer, openStats, timeoutResult, setTimeoutResult, timeLooser } ) => {

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  const [transformingCell, setTransformingCell] = useState<Cell | null>(null);
  const [isTransformingCell, setIsTransformingCell] = useState<boolean>(false);
  const [pawnColor, setPawnColor] = useState<Colors>(Colors.WHITE);
  const { setCheckToKing } = useCheckToKing(false);
  const [checkDialog, setCheckDialog] = useState<boolean>(false);
  const [checkmateDialog, setCheckmateDialog] = useState<boolean>(false);
  const [stalemate, setStalemate] = useState<boolean>(false);

  useEffect(
    () => { 
      highlightCells();
      ifKingUnderCheck();
      ifCheckmate();
      ifStalemate();
    },
    [selectedCell]
  );
  
  const ifKingUnderCheck = () => {
    setCheckToKing(board.isKingUnderCheck(currentPlayer));
  }

  const ifStalemate = () => {
    setStalemate(board.isStalemate(currentPlayer));
  }

  const ifCheckmate = () => {
    setCheckmateDialog(board.isCheckmate(currentPlayer));
  }

  const clickCell = (cell: Cell) => {
    if(selectedCell && (selectedCell !== cell) && selectedCell.figure?.isMoveble(cell)) {
      selectedCell.moveFigure(cell);
      tryCheck(cell);
      tryTransformPawn(cell);
      swapPlayer();
      setSelectedCell(null);
      updateBoard();
    } else {
      if(cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  const tryTransformPawn = (cell: Cell) => {  // Open dialog to select figure for pawn transformation
    const border = cell.figure?.color === Colors.WHITE ? 0 : 7;
    if(cell.figure?.name === FigureNames.PAWN && cell.y === border) {
      setPawnColor(cell.figure?.color);
      setTransformingCell(cell);
      setIsTransformingCell(true);
    }
  }

  const tryCheck = (cell: Cell) => {
    let figure = cell.figure;
    let isCheckMade = figure?.tryCheckAndDo();
    if(!isCheckMade) {
      isCheckMade = figure?.tryHiddenCheck(); // If check not made directly - define if check hidden
    }
    setCheckToKing(isCheckMade ? isCheckMade : false);
    setCheckDialog(isCheckMade ? isCheckMade : false);
  }

  const highlightCells = () => {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  const updateBoard = () => {
    const newBoard = board.getBoardCopy();
    setBoard(newBoard);
  }

  const selectTransformedFigure = (fname: FigureNames) => {
    if(transformingCell?.figure !== null) {
      transformingCell?.transformFigure(transformingCell.figure, fname);
      if(transformingCell !== null) {
        tryCheck(transformingCell);
      }
      setTransformingCell(null);
    }
    setIsTransformingCell(false);
  }

  return (
    <div>
      <BoardHeader currentPlayer={currentPlayer} openStats={openStats} />
      { timeoutResult && 
        <GameStatusInformationBlock 
          currentPlayer={currentPlayer}
          gameResult={timeLooser ? `${timeLooser === Colors.WHITE ? "White" : "Black"} player lost the GAME` : ""}
          info="Time is out"
          setDialog={setTimeoutResult} /> }
      { checkmateDialog && 
        <GameStatusInformationBlock
          currentPlayer={currentPlayer}
          gameResult={`${currentPlayer?.color === Colors.WHITE ? "White" : "Black"} player lost the game`}
          setDialog={setCheckmateDialog}
          info="CHECKMATE TO" />
      }
      { stalemate && 
        <GameStatusInformationBlock
          currentPlayer={currentPlayer}
          gameResult={`GAME FINISHED WITH DRAW`}
          setDialog={setStalemate}
          info="STALEMATE TO" />
      }
      { (checkDialog && !checkmateDialog) && 
        <GameStatusInformationBlock currentPlayer={currentPlayer} gameResult="" setDialog={setCheckDialog} info="CHECK TO" />
      }
      { isTransformingCell &&
        <TransformSelection color={pawnColor} onClick={selectTransformedFigure} />
      }
      <div className="board">
        { board.cells.map(
            (row, index) => 
            <React.Fragment key={index}>
              { row.map(cell => 
                            <CellComponent  key={cell.id}  clickCell={clickCell}  cell={cell}
                                            selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y} />)
              }
            </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default BoardComponent;
