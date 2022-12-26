import { Colors } from "../colors/Color";
import { Bishop } from "../figures/Bishop";
import { Figure } from "../figures/Figure";
import { King }   from "../figures/King";
import { Knight } from "../figures/Knight";
import { FigureNames } from "../figures/names/FigureNames";
import { Pawn }   from "../figures/Pawn";
import { Queen }  from "../figures/Queen";
import { Rook }   from "../figures/Rook";
import { Player } from "../player/Player";
import { Cell }   from "./Cell";

export class Board {

  cells: Cell[][] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];

  public initCells() { // init cells of chessboard
    let i,j;
    for (i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (j = 0; j < 8; j++) {
        if((i + j) % 2 !== 0) {
          row.push(new Cell(this, j, i, Colors.BLACK, null, j + i * 8));
        } else {
          row.push(new Cell(this, j, i, Colors.WHITE, null, j + i * 8));
        }
      }
      this.cells.push(row);
    }
  }

  public setPosition() { // method to test different positions

    // Position 1. Transforming figures
    /**
    new King(Colors.BLACK,   this.getCell(5,1));
    new Knight(Colors.BLACK, this.getCell(5,5));
    new Pawn(Colors.BLACK,   this.getCell(5,3)).isFirstStep = false;
    new Pawn(Colors.BLACK,   this.getCell(6,3)).isFirstStep = false;
    new King(Colors.WHITE,   this.getCell(6,5));
    new Rook(Colors.WHITE,   this.getCell(0,2));
    new Bishop(Colors.WHITE, this.getCell(0,1));
    new Knight(Colors.WHITE, this.getCell(2,3));
    new Pawn(Colors.WHITE,   this.getCell(6,1));
    new Pawn(Colors.WHITE,   this.getCell(7,1));
    new Pawn(Colors.WHITE,   this.getCell(7,2)).isFirstStep = false;
    */
    
    // Position 2. Castling LONG and SHORT
    /** 
    new King(Colors.BLACK,   this.getCell(4,0));
    new Rook(Colors.BLACK,   this.getCell(7,0));
    new Rook(Colors.BLACK,   this.getCell(0,0));
    new Bishop(Colors.BLACK, this.getCell(2,3));
    new Pawn(Colors.BLACK,   this.getCell(5,1));
    new Pawn(Colors.BLACK,   this.getCell(6,1));
    new Pawn(Colors.BLACK,   this.getCell(7,1));
    new Pawn(Colors.BLACK,   this.getCell(3,2));
    new King(Colors.WHITE,   this.getCell(4,7));
    new Bishop(Colors.WHITE, this.getCell(4,6));
    new Rook(Colors.WHITE,   this.getCell(0,7));
    new Rook(Colors.WHITE,   this.getCell(7,7));
    new Pawn(Colors.WHITE,   this.getCell(0,6));
    new Pawn(Colors.WHITE,   this.getCell(1,6));
    new Pawn(Colors.WHITE,   this.getCell(2,6));
    */

    // Position 3. Checkmate
    /** 
    new King(Colors.BLACK,   this.getCell(4,0));
    new Pawn(Colors.BLACK,   this.getCell(0,5));
    new Pawn(Colors.BLACK,   this.getCell(1,1));
    new Bishop(Colors.BLACK, this.getCell(1,3));
    new Knight(Colors.BLACK, this.getCell(1,4));
    new Queen(Colors.BLACK,  this.getCell(6,1));
    new Rook(Colors.BLACK,   this.getCell(1,2));
    new Rook(Colors.BLACK,   this.getCell(2,3));
    new Pawn(Colors.BLACK,   this.getCell(7,5)).isFirstStep = false;
    new King(Colors.WHITE,   this.getCell(4,7));
    new Rook(Colors.WHITE,   this.getCell(2,1));
    new Rook(Colors.WHITE,   this.getCell(7,2));
    new Knight(Colors.WHITE, this.getCell(4,2));
    new Knight(Colors.WHITE, this.getCell(2,4));
    new Bishop(Colors.WHITE, this.getCell(4,4));
    new Queen(Colors.WHITE,  this.getCell(5,5));
    (new Pawn(Colors.WHITE,   this.getCell(5,2))).isFirstStep = false;
    new Pawn(Colors.WHITE,   this.getCell(0,6));
    */

    // Position 4. King behind the figure (test for hidden check)
    /** 
    new King(Colors.BLACK,   this.getCell(4,0));
    new Pawn(Colors.BLACK,   this.getCell(4,1));
    new Queen(Colors.BLACK,  this.getCell(4,2));
    // new Bishop(Colors.BLACK, this.getCell(4,3));
    // new Knight(Colors.BLACK, this.getCell(4,3));
    new King(Colors.WHITE,   this.getCell(4,7));
    new Queen(Colors.WHITE,  this.getCell(5,5));
    new Rook(Colors.WHITE,   this.getCell(0,6));
    new Bishop(Colors.WHITE, this.getCell(2,7));
    */

    // Position 5. Check with Pawn 
    /** 
    new King(Colors.BLACK,   this.getCell(4,0));
    new Pawn(Colors.BLACK,   this.getCell(0,1));
    new Pawn(Colors.BLACK,   this.getCell(1,1));
    new Pawn(Colors.BLACK,   this.getCell(6,1));
    new Pawn(Colors.BLACK,   this.getCell(7,1));
    new King(Colors.WHITE,   this.getCell(1,5));
    */
  }

  public arrangeChessboard() { // Standard figure arrangement at the chessboard
    new Rook(Colors.WHITE,   this.getCell(0,7)); // White figures
    new Knight(Colors.WHITE, this.getCell(1,7));
    new Bishop(Colors.WHITE, this.getCell(2,7));
    new Queen(Colors.WHITE,  this.getCell(3,7));
    new King(Colors.WHITE,   this.getCell(4,7));
    new Bishop(Colors.WHITE, this.getCell(5,7));
    new Knight(Colors.WHITE, this.getCell(6,7));
    new Rook(Colors.WHITE,   this.getCell(7,7));
    new Rook(Colors.BLACK,   this.getCell(0,0)); // Black figures
    new Knight(Colors.BLACK, this.getCell(1,0));
    new Bishop(Colors.BLACK, this.getCell(2,0));
    new Queen(Colors.BLACK,  this.getCell(3,0));
    new King(Colors.BLACK,   this.getCell(4,0));
    new Bishop(Colors.BLACK, this.getCell(5,0));
    new Knight(Colors.BLACK, this.getCell(6,0));
    new Rook(Colors.BLACK,   this.getCell(7,0));
    let i = 0; // Set pawns
    while(i < 8) {
        new Pawn(Colors.BLACK, this.getCell(i,1));
        new Pawn(Colors.WHITE, this.getCell(i++,6));
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  public getKingFigure(currentPlayer:Player | null): Figure | null {
    let figure, i = 0, j = 0;
    for (i = 0; i < this.cells.length; i++) {
      for (j = 0; j < this.cells[i].length; j++) {
        figure = this.cells[i][j].figure;
        if(figure !== null) {
          if((figure.name === FigureNames.KING) &&
             (figure.color === currentPlayer?.color)) {
              return figure;
          }
        }
      }
    }
    return null;
  }

  public isKingUnderCheck(currentPlayer:Player | null):boolean {
    const figure = this.getKingFigure(currentPlayer);
    const king = figure as King;
    if(king) {
      return king.underCheck;
    }
    return false;
  }
  
  public isCheckmate(currentPlayer:Player | null) {
    const figure = this.getKingFigure(currentPlayer);
    const king = figure as King;
    if(king) {
      return king.isCheckmate() && !this.areMovesAvailable(currentPlayer);
    }
    return false;
  }

  public isStalemate(currentPlayer:Player | null):boolean { // Situation of Draw
    const figure = this.getKingFigure(currentPlayer);
    const king = figure as King;
    if(king) {
      return !king.isCheckmate() && !king.hasAvailableMoves() && !this.areMovesAvailable(currentPlayer);
    }
    return false;
  }

  public highlightCells(selectedCell:Cell | null) { // Method that should look through all cells and change "available" property
    let i,j;
    for (i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (j = 0; j < row.length; j++) {
        const target = row[j];
        target.available = !!selectedCell?.figure?.isMoveble(target);
      }
    }
  }

  public areMovesAvailable(currentPlayer:Player | null):boolean { // For all figures except the king
    let figure, i = 0, j = 0;
    for (i = 0; i < this.cells.length; i++) {
      for (j = 0; j < this.cells[i].length; j++) {
        figure = this.cells[i][j].figure;
        if((figure !== null) && 
           (figure.name !== FigureNames.KING) && 
           (figure.color === currentPlayer?.color)) {
          if (figure.hasAvailableMoves()) {
            return true;
          }
        }
      }
    }
    return false;
  }

  public getBoardCopy(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    return newBoard;
  }

  public findOwnKingPosition(figure : Figure): Cell {
    let position = this.cells[0][0];
    let i = 0, j = 0;
    for(i = 0; i < 8; i++) {
      for(j = 0; j < 8; j++) {
        if((this.cells[i][j].figure?.name === FigureNames.KING) && 
           (this.cells[i][j].figure?.color === figure.color)) {
            position = this.cells[i][j];
            break;
        }
      }
    }
    return position;
  }

}
