import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class Bishop extends Figure {

    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "9815" : "9821";
        this.name = FigureNames.BISHOP;
    }

    isMoveble(target: Cell): boolean {
        if(!super.isMoveble(target)) {
            return false;
        }
        if(this.cell.isEmptyDiagonal(target)) {
            return true;
        }
        return false;
    }
}
