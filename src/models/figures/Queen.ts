import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class Queen extends Figure {
    
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "&#9813;" : "&#9819;";
        this.name = FigureNames.QUEEN;
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
        if(this.cell.isEmptyDiagonal(target)) {
            return true;
        }
        return false;
    }
    
}
