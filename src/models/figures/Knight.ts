import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "./Figure";

export class Knight extends Figure {
    constructor(color: Colors, cell: Cell) {
        super(color, cell);
        this.logo = (color === Colors.WHITE) ? "&#9816;" : "&#9822;";
        this.name = FigureNames.KNIGHT;
    }

    isMoveble(target: Cell): boolean {
        if(!super.isMoveble(target)) {
            return false;
        }
        const dx = Math.abs(this.cell.x - target.x);
        const dy = Math.abs(this.cell.y - target.y);
        return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
    }
}
