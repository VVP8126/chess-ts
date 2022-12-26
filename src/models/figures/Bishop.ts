import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure } from "./Figure";
import { FigureNames } from "./names/FigureNames";

export class Bishop extends Figure {

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = (color === Colors.WHITE) ? "9815" : "9821";
    this.name = FigureNames.BISHOP;
  }

  public isMoveble(target: Cell): boolean {
    if(!super.isMoveble(target)) {
      return false;
    }
    if(!super.isKingHiddenBehindTheFigure(target)) {
      const kingPosition = this.cell.board.findOwnKingPosition(this);
      if(!kingPosition.figure?.underCheck) {
        return (this.cell.isEmptyDiagonal(target) && !super.isKingHiddenBehindTheFigure(target));
      } else {
        if(super.findThreatPosition(kingPosition, target)?.figure?.name === FigureNames.KNIGHT ||
           super.findThreatPosition(kingPosition, target)?.figure?.name === FigureNames.PAWN) {
             return this.isThreatFigureCanBeTaken(kingPosition, target);
        }
        return this.isThreatFigureCanBeTaken(kingPosition, target) || this.isKingCanBeHidden(kingPosition, target);
      }
    }
    return false;
  }

  public isThreatFigureCanBeTaken(kingPosition: Cell, target: Cell): boolean {
    const threatPosition = super.findThreatPosition(kingPosition, target);
    if(threatPosition) {
      return ((target.x === threatPosition.x && target.y === threatPosition.y) && 
              this.cell.isEmptyDiagonal(target)) ||
             ((target.x === threatPosition.x && target.y === threatPosition.y) && 
              this.cell.isEmptyDiagonal(target));
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
        return this.cell.isEmptyDiagonal(target) &&
               ((((target.x - kingPosition.x) / dx === (target.y - kingPosition.y) / dy) || 
                 ((target.y === threatPosition.y) && (target.y === kingPosition.y))) &&
                !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x))) ||
                ((target.x === threatPosition.x && target.x === kingPosition.x) && 
                 !(((target.y > kingPosition.y) && (target.y > threatPosition.y)) || ((target.y < kingPosition.y) && (target.y < threatPosition.y))))
               );
      }
    }
    return false;
  }

  public canProtectCell(target: Cell): boolean {
    if(!super.canProtectCell(target)) {
      return false;
    }
    return this.cell.isEmptyDiagonal(target, 0);
  }

  public tryCheckAndDo(): boolean {
    let x = this.cell.x;
    let y = this.cell.y;
    return this.tryCheckOnDiagonal(x,y);
  }
  
}
