import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure } from "./Figure";
import { King } from "./King";
import { FigureNames } from "./names/FigureNames";

export class Knight extends Figure {

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = (color === Colors.WHITE) ? "&#9816;" : "&#9822;";
    this.name = FigureNames.KNIGHT;
  }

  public isMoveble(target: Cell): boolean {
    if(!super.isMoveble(target)) {
      return false;
    }
    if(!super.isKingHiddenBehindTheFigure(target)) {
      const dx = Math.abs(this.cell.x - target.x);
      const dy = Math.abs(this.cell.y - target.y);
      const kingPosition = this.cell.board.findOwnKingPosition(this);
      if(!kingPosition.figure?.underCheck) {
        return ((dx === 1 && dy === 2) || (dx === 2 && dy === 1));
      }
      else {
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
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    const threatPosition = (kingPosition.figure as King).cellWithThreat;
    if(threatPosition) {
      return ((target.x === threatPosition.x && target.y === threatPosition.y) && 
              (dx === 1 && dy === 2)) ||
             ((target.x === threatPosition.x && target.y === threatPosition.y) && 
              (dx === 2 && dy === 1));
      }
    return false;
  }

  public isKingCanBeHidden(kingPosition: Cell, target: Cell):boolean {
    const threatPosition = super.findThreatPosition(kingPosition, target);
    if(threatPosition) {
      if((kingPosition.x - threatPosition.x === 1) || (kingPosition.y - threatPosition.y === 1)) {
        return false;
      } else {
        const kx = Math.abs(this.cell.x - target.x);
        const ky = Math.abs(this.cell.y - target.y);
        const dx = threatPosition.x - kingPosition.x > 0 ? 1 : -1;
        const dy = threatPosition.y - kingPosition.y > 0 ? 1 : -1;
        if(kingPosition.x === threatPosition.x) {
          return ((kx === 1 && ky === 2) || (kx === 2 && ky === 1)) &&
                 (target.x === kingPosition.x) && 
                 !(((target.y > kingPosition.y) && (target.y > threatPosition.y)) || ((target.y < kingPosition.y) && (target.y < threatPosition.y)));
        } else if(kingPosition.y === threatPosition.y) {
          return ((kx === 1 && ky === 2) || (kx === 2 && ky === 1)) &&
                 (target.y === kingPosition.y) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x))); 
        } else {
          return ((kx === 1 && ky === 2) || (kx === 2 && ky === 1)) &&
                 ((target.x - kingPosition.x) / dx === (target.y - kingPosition.y) / dy) &&
                 !(((target.x > kingPosition.x) && (target.x > threatPosition.x)) || ((target.x < kingPosition.x) && (target.x < threatPosition.x)));
        }
      }
    }
    return false;
  }

  public canProtectCell(target: Cell): boolean {
    if(!super.canProtectCell(target)) {
      return false;
    }
    const dx = Math.abs(this.cell.x - target.x);
    const dy = Math.abs(this.cell.y - target.y);
    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }

  public tryCheckAndDo(): boolean {
    let deltas = [ [-2,-1], [-1,-2], [-2,1], [-1,2], [2,-1], [1,-2], [2,1], [1,2] ];
    let i = 0;
    let x = this.cell.x;
    let y = this.cell.y;
    let figure;
    while(i < deltas.length) {
      if((y + deltas[i][0] >= 0) && (y + deltas[i][0] < 8) &&
         (x + deltas[i][1] >= 0) && (x + deltas[i][1] < 8)) {
            figure = this.cell.board.cells[y + deltas[i][0]][x + deltas[i][1]].figure;
            if(figure !== null) {
              if((figure.name === FigureNames.KING) &&
                 (this.color !== figure.color)) {
                  const king = this.cell.board.cells[y + deltas[i][0]][x + deltas[i][1]].figure as King;
                  king.setCheck(true);
                  king.setCellWithThreat(this.cell);
                  return true;
              }
            }
      }
      i++;
    }
    return false;
  }
}
