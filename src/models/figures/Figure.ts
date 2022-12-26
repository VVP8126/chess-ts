import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { King } from "./King";
import { FigureNames } from "./names/FigureNames";
import { Pawn } from "./Pawn";

export class Figure {
    
  color: Colors;
  logo: string | null;
  cell: Cell;
  name: FigureNames;
  id: number;
  underCheck: boolean;
  
  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.logo = null;
    this.cell = cell;
    this.cell.figure = this;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
    this.underCheck = false;
  }
  
  public isMoveble(target: Cell): boolean {
    if(target.figure?.color === this.color) {
      return false; // figures of the same color can't take each other !!!
    }
    if(target.figure?.name === FigureNames.KING) {
      return false; // The King can't be taken with a figure !!!
    }
    return true;
  }
  
  public tryCheckAndDo():boolean { return false; }

  public canProtectCell(target: Cell): boolean {
    if(this.cell.x === target.x && this.cell.y === target.y) {
      return false;
    }
    return true;
  }

  public findEnemyKingPosition():Cell {   // Find position of enemy king
    let currentColor = this.color;
    let i: number = 0;
    let j: number = 0;
    let enemyKingPosition: Cell = this.cell.board.cells[0][0];
    for(i = 0; i < 8; i++) {
      for(j = 0; j < 8; j++) {
        if((this.cell.board.cells[i][j].figure?.name === FigureNames.KING) && 
           (this.cell.board.cells[i][j].figure?.color !== currentColor)) {
            enemyKingPosition = this.cell.board.cells[i][j];
            break;
        }
      }
    }
    return enemyKingPosition;
  }

  public tryHiddenCheck():boolean {
    // Hidden check - situation when check is made not with touched figure but other that hides behind moved one
    let currentColor = this.color;
    let i: number = 0;
    let j: number = 0;
    const enemyKingPosition = this.findEnemyKingPosition(); // Define enemy King position
    while(i < 8) { // Find Bishop(s), Rook(s), Qween (only they can make hidden check) and try check enemy King 
      while(j < 8) {
        if((this.cell.board.cells[i][j].figure?.name === FigureNames.QUEEN) && 
           (this.cell.board.cells[i][j].figure?.color === currentColor)) {
            if(this.cell.board.cells[i][j].figure?.tryCheckOnDiagonal(enemyKingPosition?.x, enemyKingPosition?.y) ||
               this.cell.board.cells[i][j].figure?.tryCheckOnHorizontal(enemyKingPosition?.x, enemyKingPosition?.y) ||
               this.cell.board.cells[i][j].figure?.tryCheckOnVertical(enemyKingPosition?.x, enemyKingPosition?.y)) {
                 return true;
            }
        }
        if((this.cell.board.cells[i][j].figure?.name === FigureNames.BISHOP) && 
           (this.cell.board.cells[i][j].figure?.color === currentColor)) {
            if(this.cell.board.cells[i][j].figure?.tryCheckOnDiagonal(enemyKingPosition?.x, enemyKingPosition?.y)) {
              return true;
            }
        }
        if((this.cell.board.cells[i][j].figure?.name === FigureNames.ROOK) && 
           (this.cell.board.cells[i][j].figure?.color === currentColor)) {
             if(this.cell.board.cells[i][j].figure?.tryCheckOnHorizontal(enemyKingPosition?.x, enemyKingPosition?.y) ||
                this.cell.board.cells[i][j].figure?.tryCheckOnVertical(enemyKingPosition?.x, enemyKingPosition?.y)) {
                  return true;
             }
        }
        j++;
      }
      j = 0;
      i++;
    }
    return false;
  }

  public hasAvailableMoves():boolean {
    let i,j;
    for (i = 0; i < this.cell.board.cells.length; i++) {
      const row = this.cell.board.cells[i];
      for (j = 0; j < row.length; j++) {
        const target = row[j];
        if(this.isMoveble(target)) {
          return true;
        }
      }
    }
    return false;
  }

  public tryCheckOnHorizontal(x: number, y: number): boolean {
    const enemyKingCell = this.findEnemyKingPosition();
    const result = this.cell.isEmptyHorizontal(enemyKingCell)
    if(result) {
      const king = enemyKingCell.figure as King;
      king.underCheck = true;
      king.setCellWithThreat(this.cell);
    }
    return result;
  }

  public tryCheckOnVertical(x: number, y: number): boolean {
    const enemyKingCell = this.findEnemyKingPosition();
    const result = this.cell.isEmptyVertical(enemyKingCell)
    if(result) {
      const king = enemyKingCell.figure as King;
      king.underCheck = true;
      king.setCellWithThreat(this.cell);
    }
    return result;
  }

  public tryCheckOnDiagonal(x: number, y: number): boolean {
    const enemyKingCell = this.findEnemyKingPosition();
    const result = this.cell.isEmptyDiagonal(enemyKingCell);
    if(result) {
      const king = enemyKingCell.figure as King;
      king.underCheck = true;
      king.setCellWithThreat(this.cell);
    }
    return result;
  }
  
  public setCheck(val: boolean) {}
  
  public move(target: Cell): void {
    this.clearEnPassante(); // Clean property isEnPassantable (of pawns) after enemy move. This prop should be available before move
    this.clearCheck();      // Clear King check property
  }

  public clearCheck():void {
    const king = this.cell.board.findOwnKingPosition(this).figure as King;
    king.setCheck(false);
    king.setCellWithThreat(null);
  }

  public clearEnPassante():void {
    let i = 0;
    let j = 3;
    let currentFigure;
    while(i < 8) {
      while(j < 5) { // Clean property of pawns in 3 and 4 row of chessboard
        currentFigure = this.cell.board.getCell(i, j).figure;
        if(currentFigure && currentFigure.name === FigureNames.PAWN) {
          currentFigure = this.cell.board.getCell(i, j).figure as Pawn;
          currentFigure.isEnPassantable = false;
        }
        j++;
      }
      j = 3;
      i++;
    }
  }

  public findThreatPosition(kingPosition: Cell, target: Cell):Cell | null {
    return (kingPosition.figure as King).cellWithThreat;
  }

  public isThreatFigureCanBeTaken(kingPosition: Cell, target: Cell): boolean {
    return false;
  }

  public isKingHiddenBehindOnVertical(target: Cell):boolean {
    const kingPosition = this.cell.board.findOwnKingPosition(this);
    if((kingPosition.x === this.cell.x) && (this.cell.x !== target.x) && this.cell.isEmptyVertical(kingPosition)) {
      const dy = this.cell.y - kingPosition.y > 0 ? 1 : -1;
      const limit = this.cell.y - kingPosition.y > 0 ? 8 : -1;
      let currentY = dy + this.cell.y;
      let currentFigure;
      while(currentY !== limit) {
        currentFigure = this.cell.board.getCell(this.cell.x, currentY).figure;
        if(currentFigure) {
          return (((currentFigure.name === FigureNames.QUEEN) && (currentFigure.color !== this.color)) ||
                  ((currentFigure.name === FigureNames.ROOK) && (currentFigure.color !== this.color))) 
        }
        currentY = currentY + dy;
      }
    }
    return false;
  }

  public isKingHiddenBehindOnHorizontal(target: Cell):boolean {
    const kingPosition = this.cell.board.findOwnKingPosition(this);
    if((kingPosition.y === this.cell.y) && (this.cell.y !== target.y) && this.cell.isEmptyHorizontal(kingPosition)) {
      const dx = this.cell.x - kingPosition.x > 0 ? 1 : -1;
      const limit = this.cell.x - kingPosition.x > 0 ? 8 : -1;
      let currentX = dx + this.cell.x;
      let currentFigure;
      while(currentX !== limit) {
        currentFigure = this.cell.board.getCell(currentX, this.cell.y).figure;
        if(currentFigure) {
          return (((currentFigure.name === FigureNames.QUEEN) && (currentFigure.color !== this.color)) ||
                  ((currentFigure.name === FigureNames.ROOK)  && (currentFigure.color !== this.color)));
        }
        currentX = currentX + dx;
      }
    }
    return false;
  }

  public isKingHiddenBehindOnDiagonal(target: Cell):boolean {
    const kingPosition = this.cell.board.findOwnKingPosition(this);
    const tdx = this.cell.x - target.x > 0 ? 1 : -1;
    const tdy = this.cell.y - target.y > 0 ? 1 : -1;
    const kdx = kingPosition.x - this.cell.x > 0 ? 1 : -1;
    const kdy = kingPosition.y - this.cell.y > 0 ? 1 : -1;
    if(!(((Math.abs(this.cell.x - target.x) === Math.abs(this.cell.y - target.y)) && (tdx === kdx && tdy === kdy)) || ((Math.abs(this.cell.x - target.x) === Math.abs(this.cell.y - target.y)) && (tdx === -kdx && tdy === -kdy))) && this.cell.isEmptyDiagonal(kingPosition)) {
      const dx = this.cell.x - kingPosition.x > 0 ? 1 : -1;
      const dy = this.cell.y - kingPosition.y > 0 ? 1 : -1;
      const limitX = this.cell.x - kingPosition.x > 0 ? 8 : -1;
      const limitY = this.cell.y - kingPosition.y > 0 ? 8 : -1;
      let currentX = dx + this.cell.x;
      let currentY = dy + this.cell.y;
      let currentFigure;
      while(currentX !== limitX && currentY !== limitY) {        
        currentFigure = this.cell.board.getCell(currentX, currentY).figure;
        if(currentFigure) {
          return (((currentFigure.name === FigureNames.QUEEN) && (currentFigure.color !== this.color)) ||
                  ((currentFigure.name === FigureNames.BISHOP)  && (currentFigure.color !== this.color)));
        }
        currentX += dx;
        currentY += dy;
      }
    }
    return false;
  }
  
  public isKingHiddenBehindTheFigure(target: Cell):boolean {
    return (this.isKingHiddenBehindOnVertical(target)   || 
            this.isKingHiddenBehindOnHorizontal(target) || 
            this.isKingHiddenBehindOnDiagonal(target)      );
  }
}