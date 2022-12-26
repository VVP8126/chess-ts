import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure } from "./Figure";
import { King } from "./King";
import { FigureNames } from "./names/FigureNames";

export class Pawn extends Figure {

  isFirstStep: boolean = true;
  isEnPassantable: boolean = false; // can be taken at 1t step (at move for 2 cells) - from 'en passant'
  
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = (color === Colors.WHITE) ? "9817" : "9823";
    this.name = FigureNames.PAWN;
  }

  public isThreatFigureCanBeTaken(kingPosition: Cell, target: Cell): boolean {
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const threatPosition = (kingPosition.figure as King).cellWithThreat;
    return (((target.y === this.cell.y + direction) && (target.x === this.cell.x + 1) && (threatPosition?.x === target.x) && (threatPosition?.y === target.y)) || 
            ((target.y === this.cell.y + direction) && (target.x === this.cell.x - 1) && (threatPosition?.x === target.x) && (threatPosition?.y === target.y)));
  }

  public isMoveble(target: Cell): boolean {
    if(!super.isMoveble(target)) {
      return false;
    }
    if(!super.isKingHiddenBehindTheFigure(target)) {
      const kingPosition = this.cell.board.findOwnKingPosition(this);
      if(!kingPosition.figure?.underCheck) {
        if(this.canItTakePawnEnPassantable(target)) {
          return true;
        }
        if(this.canItBeMoved(target)) {
          return true;
        }
        if(this.canItTakeFigure(target)) {
          return true;
        }
        return false;
      } else {
        if(super.findThreatPosition(kingPosition, target)?.figure?.name === FigureNames.KNIGHT ||
           super.findThreatPosition(kingPosition, target)?.figure?.name === FigureNames.PAWN) {
            return this.isThreatFigureCanBeTaken(kingPosition, target);
        }
        return this.isThreatFigureCanBeTaken(kingPosition, target) || this.isKingCanBeHidden(kingPosition, target);
      }
    } else return false;
  }

  public canItBeMoved(target: Cell):boolean {  /** Condition for moving test(check) */
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;  
    if(((target.y === this.cell.y + direction) || 
        (this.isFirstStep && 
          ((target.y === this.cell.y + firstStepDirection) && 
           this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()
          )
        )
       ) && 
       (target.x === this.cell.x) && 
       this.cell.board.getCell(target.x, target.y).isEmpty()) {
          return true;
    }
    return false;
  }

  public canItTakeFigure(target: Cell):boolean { 
    /** Condition for taking */
    if((target.y === this.cell.y + (this.cell.figure?.color === Colors.BLACK ? 1 : -1)) &&
       (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
       this.cell.isEnemy(target)) {
      return true;
    }
    return false;
  }

  public canItTakePawnEnPassantable(target: Cell): boolean {
    let cellUnderEnPassantable = this.findCellEnPassantable(target);
    // Pawn on the EnPassantable cell can be only at 3d or 4th vertical !!!
    if((cellUnderEnPassantable && cellUnderEnPassantable.y === 3) || // For black pawns - in short (cellUnderEnPassantable.y === 3 && cellUnderEnPassantable?.figure?.color = Colors.BLACK)
       (cellUnderEnPassantable && cellUnderEnPassantable.y === 4)) { // For white pawns - in short (cellUnderEnPassantable.y === 4 && cellUnderEnPassantable?.figure?.color = Colors.WHITE)
          const delta = this.color === Colors.BLACK ? 1 : -1;
          if((target.y === cellUnderEnPassantable.y + delta) &&
             (target.x === cellUnderEnPassantable.x)) {
               return true;
          }
    }
    return false;
  }

  public isKingCanBeHidden(kingPosition: Cell, target: Cell):boolean {
    const threatPosition = super.findThreatPosition(kingPosition, target);
    if(threatPosition) {
      if((kingPosition.x - threatPosition.x === 1) || (kingPosition.y - threatPosition.y === 1)) {
        return false;
      } else {
        const dx = threatPosition.x - kingPosition.x > 0 ? 1 : -1;
        const dy = threatPosition.y - kingPosition.y > 0 ? 1 : -1;
        if(kingPosition.y === threatPosition.y) {
          return (this.canItBeMoved(target)) &&
                 (target.y === kingPosition.y) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x))); 
        } else {
          return (this.canItBeMoved(target)) &&
                 ((target.x - kingPosition.x) / dx === (target.y - kingPosition.y) / dy) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x)));
        }
      }
    }
    return false;
  }

  public canProtectCell(target: Cell): boolean {
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    return (target.y === this.cell.y + direction) &&
           (target.x === this.cell.x + 1 || target.x === this.cell.x - 1);
  }

  public findCellEnPassantable(target: Cell): Cell | null {
    const x = this.cell.x;
    const y = this.cell.y;
    let result = null;
    if(x === 0) {
      if((this.cell.board.cells[y][1].figure?.name === FigureNames.PAWN) &&
         (this.cell.board.cells[y][1].figure?.color !== this.color)) {
            let pawn = this.cell.board.cells[y][1].figure as Pawn;
            if(pawn.isEnPassantable) {
              return this.cell.board.cells[y][1];
            }
      }
    }
    else if(x === 7) {
      if((this.cell.board.cells[y][6].figure?.name === FigureNames.PAWN) &&
         (this.cell.board.cells[y][6].figure?.color !== this.color)) {
            let pawn = this.cell.board.cells[y][6].figure as Pawn;
            if(pawn.isEnPassantable) {
              return this.cell.board.cells[y][6];
            }
      }
    } else {
      if((this.cell.board.cells[y][x - 1].figure?.name === FigureNames.PAWN) &&
         (this.cell.board.cells[y][x - 1].figure?.color !== this.color)) {
           let pawn = this.cell.board.cells[y][x - 1].figure as Pawn;
           if(pawn.isEnPassantable) {
             return this.cell.board.cells[y][x - 1];
           }
      }
      if((this.cell.board.cells[y][x + 1].figure?.name === FigureNames.PAWN) &&
         (this.cell.board.cells[y][x + 1].figure?.color !== this.color)) {
           let pawn = this.cell.board.cells[y][x + 1].figure as Pawn;
           if(pawn.isEnPassantable) {
             return this.cell.board.cells[y][x + 1];
           }
      }
    }
    return result;
  }

  public move(target: Cell): void {
    if(this.isFirstStep) {
      if(((this.color === Colors.BLACK) && (this.cell.y === 1)) ||
         ((this.color === Colors.WHITE) && (this.cell.y === 6))) {
           this.isEnPassantable = true;
      } else this.isEnPassantable = false;
    } else {
      this.isEnPassantable = false;
    }
    this.isFirstStep = false;
    super.clearCheck();
  }

  public tryCheckAndDo(): boolean {
    let x = this.cell.x;
    let y = this.cell.y;
    let direction = (this.color === Colors.BLACK ? 1 : -1);
    let result = false;
    if((y === 0) || y === 7) {
        return false;
    }
    if(x + 1 < 8) {
      result = this.setCheckToKing(x, y, direction, 1);
      if(result) return result;
    }
    if(x - 1 >= 0) {
      return this.setCheckToKing(x, y, direction, -1);
    }
    return result;
  }

  public setCheckToKing(x: number, y:number, direction: number, delta: number): boolean {
    let figure = this.cell.board.cells[y + direction][x + delta].figure;
    if(figure !== null) {
      if((figure.name === FigureNames.KING) && (this.color !== figure.color)) {
        let king = this.cell.board.cells[y + direction][x + delta].figure as King;
        king?.setCheck(true);
        king?.setCellWithThreat(this.cell);
        // console.log("" + (king.color === Colors.WHITE ? "White " : "Black ") + king.name + " is under check: " + king.underCheck);
        return true;
      }
    }
    return false;
  }
}
