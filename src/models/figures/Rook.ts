import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class Rook extends Figure {
    
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "9814" : "9820";
        this.name = FigureNames.ROOK;
    }

    isMoveble(target: Cell): boolean {
        if(!super.isMoveble(target)) {
            return false;
        }
        if(this.cell.isEmptyVertical(target)) {
            return true;
        }
        if(this.cell.isEmptyHorizontal(target)) {
            return true;
        }
        return false;
    }
    
}
