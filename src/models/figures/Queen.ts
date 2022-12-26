import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure } from "./Figure";
import { FigureNames } from "./names/FigureNames";

export class Queen extends Figure {
    
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = (color === Colors.WHITE) ? "&#9813;" : "&#9819;";
    this.name = FigureNames.QUEEN;
  }
  
  public isMoveble(target: Cell): boolean {
    if(!super.isMoveble(target)) {
      return false;
    }
    if(!super.isKingHiddenBehindTheFigure(target)) {
      const kingPosition = this.cell.board.findOwnKingPosition(this);
      if(!kingPosition.figure?.underCheck) {
        return ((this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target) || this.cell.isEmptyDiagonal(target)));
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

  public isKingCanBeHidden(kingPosition: Cell, target: Cell):boolean {
    const threatPosition = super.findThreatPosition(kingPosition, target);
    if(threatPosition) {
      if((kingPosition.x - threatPosition.x === 1) || (kingPosition.y - threatPosition.y === 1)) {
        return false;
      } else {
        const dx = threatPosition.x - kingPosition.x > 0 ? 1 : -1;
        const dy = threatPosition.y - kingPosition.y > 0 ? 1 : -1;
        if(kingPosition.x === threatPosition.x) {
          return (this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target) || this.cell.isEmptyDiagonal(target)) &&
                 (target.x === kingPosition.x) && 
                 !(((target.y > kingPosition.y) && (target.y > threatPosition.y)) || ((target.y < kingPosition.y) && (target.y < threatPosition.y)));
        } else if(kingPosition.y === threatPosition.y) {
          return (this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target) || this.cell.isEmptyDiagonal(target)) &&
                 (target.y === kingPosition.y) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x))); 
        } else {
          return (this.cell.isEmptyVertical(target) || this.cell.isEmptyHorizontal(target) || this.cell.isEmptyDiagonal(target)) &&
                 ((target.x - kingPosition.x) / dx === (target.y - kingPosition.y) / dy) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x)));
        }
      }
    }
    return false;
  }

  public isThreatFigureCanBeTaken(kingPosition: Cell, target: Cell): boolean {
    const threatPosition = super.findThreatPosition(kingPosition, target);
    if(threatPosition) {
      return (((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyVertical(target)) ||
              ((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyVertical(target))) || 
             (((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyHorizontal(target)) ||
              ((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyHorizontal(target))) || 
             (((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyDiagonal(target)) ||
              ((target.x === threatPosition.x && target.y === threatPosition.y) && 
               this.cell.isEmptyDiagonal(target)));
    }
    return false;
  }

  public canProtectCell(target: Cell): boolean {
    if(!super.canProtectCell(target)) {
      return false;
    }
    return (this.cell.isEmptyDiagonal(target, 0) || this.cell.isEmptyVertical(target, 0) || this.cell.isEmptyHorizontal(target, 0));
  }
  
  public tryCheckAndDo(): boolean {
    let x = this.cell.x;
    let y = this.cell.y;
    let isCheck = this.tryCheckOnHorizontal(x,y);
    if(isCheck) {
        return isCheck;
    }
    isCheck = this.tryCheckOnVertical(x,y);
    if(isCheck) {
        return isCheck;
    }
    isCheck = this.tryCheckOnDiagonal(x,y);
    return isCheck;
  }

}
