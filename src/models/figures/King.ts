import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure } from "./Figure";
import { FigureNames } from "./names/FigureNames";
import { Rook } from "./Rook";

export class King extends Figure {

  wasMoved = false;
  cellWithThreat: Cell | null = null;
  
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.underCheck = false;
    this.logo = (color === Colors.WHITE) ? "9812" : "9818";
    this.name = FigureNames.KING;
  }

  public setCheck(val: boolean): void {
    this.underCheck = val;
  }
  public setCellWithThreat(cell: Cell | null): void {
    this.cellWithThreat = cell;
  }

  public isMoveble(target: Cell): boolean {
    if(!super.isMoveble(target)) {
      return false;
    }
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    if((dx === 1 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
      return !this.cell.isCellProtected(target, this.color);
    }
    if(!this.wasMoved && (dx === 2)) { // Condition for castling
      return ( this.isCastlingNotMade(target) && 
               !this.underCheck && 
               !this.areCellsProtectedBeforeCastling(target));
    }
    return false;
  }

  public areCellsProtectedBeforeCastling(target: Cell):boolean {
    const dx = target.x - this.cell.x > 0 ? 1 : -1;
    let count = Math.abs(this.cell.x - target.x);
    let currentX = this.cell.x;
    while (count > 0) {
      currentX += dx;
      if(this.cell.isCellProtected(this.cell.board.getCell(currentX, this.cell.y), this.color)) {
        return true;
      }
      count--;
    }
    return false;
  }

  public isCastlingNotMade(target: Cell): boolean {
    let shortCastlingRook = this.cell.board.getCell(7, this.color === Colors.WHITE ? 7 : 0).figure as Rook;
    if(shortCastlingRook && shortCastlingRook.name === FigureNames.ROOK && !this.wasMoved && !shortCastlingRook.wasMoved &&
       (target.x - this.cell.x === 2) &&
       (target.y === (this.color === Colors.WHITE ? 7 : 0))) {
         return true;
    }
    let longCastlingRook = this.cell.board.getCell(0, this.color === Colors.WHITE ? 7 : 0).figure as Rook;
    if(longCastlingRook && longCastlingRook.name === FigureNames.ROOK && !this.wasMoved && !longCastlingRook.wasMoved &&
       (this.cell.x - target.x === 2) &&
       (target.y === (this.color === Colors.WHITE ? 7 : 0))) {
         return true;
    }
    return false;
  }

  public canProtectCell(target: Cell): boolean {
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    return (dx === 1 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  public hasAvailableMoves():boolean {
    let arrX = [this.cell.x - 1, this.cell.x, this.cell.x + 1].filter(val => (val > -1 && val < 8));
    let arrY = [this.cell.y - 1, this.cell.y, this.cell.y + 1].filter(val => (val > -1 && val < 8));
    let i, j;
    let hasMoves = false;
    for (i = 0; i < arrX.length; i++) {
      for (j = 0; j < arrY.length; j++) {
        if(!(arrX[i] === this.cell.x && arrY[j] === this.cell.y)) {
          hasMoves = this.isMoveble(this.cell.board.getCell(arrX[i], arrY[j]));
          if(hasMoves) {
            return hasMoves;
          }
        } 
      }
    }
    return hasMoves;
  }

  public isCheckmate():boolean {
    return this.underCheck && !this.hasAvailableMoves();
  }

  public move(target: Cell): void {
    super.move(target);
    this.wasMoved = true;
  }

}
