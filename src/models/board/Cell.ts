import { Colors } from "../colors/Color";
import { Bishop } from "../figures/Bishop";
import { Figure } from "../figures/Figure";
import { King } from "../figures/King";
import { Knight } from "../figures/Knight";
import { FigureNames } from "../figures/names/FigureNames";
import { Queen } from "../figures/Queen";
import { Rook } from "../figures/Rook";
import { Board } from "./Board";

export class Cell {

  readonly x: number;
  readonly y: number;
  readonly color: Colors = Colors.BLACK;
  figure: Figure | null;
  board: Board;
  available: boolean;
  id: number;

  constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null, id: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = id;
  }

  public setFigure(figure: Figure): void {
    this.figure = figure;
    this.figure.cell = this;
  }

  public transformFigure(figure: Figure, fname: FigureNames): void {
    this.figure = figure;
    this.figure.cell = this;
    const border = figure.color === Colors.WHITE ? 0 : 7;
    if(figure.name === FigureNames.PAWN && this.y === border) {
      if(fname === FigureNames.QUEEN) {
        new Queen(figure.color, this.figure.cell);
      }
      if(fname === FigureNames.KNIGHT) {
        new Knight(figure.color, this.figure.cell);
      }
      if(fname === FigureNames.BISHOP) {
        new Bishop(figure.color, this.figure.cell);
      }
      if(fname === FigureNames.ROOK) {
        new Rook(figure.color, this.figure.cell);
      }
    }
  }

  public addLostFigure(figure: Figure): void {
    figure.color === Colors.BLACK 
      ? this.board.lostBlackFigures.push(figure)
      : this.board.lostWhiteFigures.push(figure);
  }

  public makeCastling(target: Cell): void {
    let x = (target.x - this.x === 2 ? 7 : 0);          // Short : Long - Castling
    let direction = (target.x - this.x === 2 ? -1 : 1);
    let rook = this.board.getCell(x, target.y).figure;
    if(this.figure && rook) {
      (this.figure as King).wasMoved = true;
      (rook as Rook).wasMoved = true;
      target.setFigure(this.figure);
      this.board.getCell(target.x + direction, target.y).setFigure(rook);
      this.figure = null;
      this.board.getCell(x, target.y).figure = null;
    }
  }

  public moveFigure(target: Cell): void {
    if(this.figure && this.figure?.isMoveble(target)) {
      if(this.figure.name === FigureNames.PAWN && this.testIfEnPassante(target)) {
        this.takeEnemyPawnEnPassante(target); // Take enemy pawn en passante
      } else if(this.figure.name === FigureNames.KING && Math.abs(this.x - target.x) === 2) {
        this.makeCastling(target);
      } else {
        this.figure?.move(target);
        if(target.figure) {
          this.addLostFigure(target.figure);
        }
        target.setFigure(this.figure);
        this.figure = null;
      }
    }
  }

  public testIfEnPassante(target: Cell):boolean {
    return !target.figure && (target.x !== this.x);
  }

  public takeEnemyPawnEnPassante(target: Cell): void {
    if(this.figure && this.figure?.isMoveble(target)) {
      let enemyPawn = this.board.getCell(target.x, this.y).figure;
      this.figure?.move(target);
      if(enemyPawn) { // Delete enemy pawn en Passante
        this.addLostFigure(enemyPawn);
        this.board.getCell(target.x, this.y).figure = null;
      }
      target.setFigure(this.figure);
      this.figure = null;
    }
  }

  public isEmpty(): boolean {
    return this.figure === null;
  }

  public isEmptyVertical(target: Cell, type: number = 1): boolean {
    if(this.x !== target.x) {
      return false;
    }
    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);
    for (let y = min + 1; y < max; y++) {
      if(type === 1) { // Default case for figure move rules
        if(!this.board.getCell(this.x, y).isEmpty()) {
          return false;
        }
      } else { // Special case to define King move rules (in a case of check)
        if(!this.board.getCell(this.x, y).isEmpty() && this.board.getCell(this.x, y).figure?.name !== FigureNames.KING ) {
          return false;
        }
        if(((this.board.getCell(this.x, y).figure?.name === FigureNames.KING) && (this.figure?.color !== this.board.getCell(this.x, y).figure?.color))) {
          continue;
        }
      }
    }
    return true;
  }

  public isEmptyHorizontal(target: Cell, type: number = 1): boolean {
    if(this.y !== target.y) {
      return false;
    }
    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);
    for (let x = min + 1; x < max; x++) {
      if(type === 1) { // Default case for figure move rules
        if(!this.board.getCell(x, this.y).isEmpty()) {
          return false;
        }
      } else { // Special case to define King move rules (in a case of check)
        if(!this.board.getCell(x, this.y).isEmpty() && this.board.getCell(x, this.y).figure?.name !== FigureNames.KING ) {
          return false;
        }
        if(((this.board.getCell(x, this.y).figure?.name === FigureNames.KING) && (this.figure?.color !== this.board.getCell(x, this.y).figure?.color))) {
          continue;
        }
      }
    }
    return true;
  }

  public isEmptyDiagonal(target: Cell, type: number = 1): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);
    if(absX !== absY) {
      return false;
    }
    const dy = this.y < target.y ? 1: -1;
    const dx = this.x < target.x ? 1: -1;
    let i = 1;
    for(; i < absY; i++) {
      if(type === 1) { // Default case for figure move rules
        if(!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
          return false;
        }
      } else { // Special case to define King move rules (in a case of check)
        if(!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty() && this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name !== FigureNames.KING ) {
          return false;
        }
        if(((this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.name === FigureNames.KING) && (this.figure?.color !== this.board.getCell(this.x + dx * i, this.y + dy * i).figure?.color))) {
          continue;
        }
      }
    }
    return true;
  }

  public isEnemy(target: Cell): boolean {  // Check for enemy by color
    if(target.figure) {
      return this.figure?.color !== target.figure?.color;
    }
    return false;
  }

  public isCellProtected(target: Cell, figureColor: Colors): boolean { // Check if a cell is protected with enemy figures (pawns)
    let i = 0, j = 0, enemyFigure, result;
    for(i = 0; i < 8; i++) {
      for(j = 0; j < 8; j++) {
        enemyFigure = this.board.getCell(i, j).figure;
        if(enemyFigure && (enemyFigure.color !== figureColor)) {
          result = enemyFigure.canProtectCell(target);
          if(result) {
            return true;
          }
        }
      }
    }
    return false;
  }

}
