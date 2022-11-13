import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class King extends Figure {
    
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "9812" : "9818";
        this.name = FigureNames.KING;
    }

    isMoveble(target: Cell): boolean {
        if(!super.isMoveble(target)) {
            return false;
        }
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);
        if((dx === 1 && dy === 1) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1) 
            && !target.isCellProtected()) {
                return true;
        }
        return false;
    }
}
