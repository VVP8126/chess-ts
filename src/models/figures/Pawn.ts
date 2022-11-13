import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class Pawn extends Figure {

    isFirstStep: boolean = true;
    isEnPassantable: boolean = true; // can be taken at 1t step (at move for 2 cells) - from 'en passant'
    
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "9817" : "9823";
        this.name = FigureNames.PAWN;
    }

    isMoveble(target: Cell): boolean {
        if(!super.isMoveble(target)) {
            return false;
        }
        const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
        const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

        /** Condition for moving check */
        if((target.y === this.cell.y + direction || this.isFirstStep 
            && ((target.y === this.cell.y + firstStepDirection) && 
                 this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty())) 
            && target.x === this.cell.x 
            && this.cell.board.getCell(target.x, target.y).isEmpty()) {
            return true;
        }
        /** End of condition for moving check */
        
        /** Condition for taking check */
        if((target.y === this.cell.y + direction) &&
           (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
           this.cell.isEnemy(target)) {
                return true;
        }
        /** End of condition for taking check */

        return false;
    }

    move(target: Cell): void {
        this.isFirstStep = false;
        this.isEnPassantable = false;
    }

}
