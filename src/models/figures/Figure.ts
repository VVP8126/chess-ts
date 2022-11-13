import { Cell } from "../board/Cell";
import { Colors } from "../colors/Color";

export enum FigureNames {
    FIGURE = "Figure",
    KING = "King",
    KNIGHT = "Knight",
    PAWN = "Pawn",
    QUEEN = "Queen",
    ROOK = "Rook",
    BISHOP = "Bishop"
}

export class Figure {
    
    color: Colors;
    logo: string | null;
    cell: Cell;
    name: FigureNames;
    id: number;

    constructor(color: Colors, cell: Cell) {
        this.color = color;
        this.logo = null;
        this.cell = cell;
        this.cell.figure = this;
        this.name = FigureNames.FIGURE;
        this.id = Math.random();
    }

    isMoveble(target: Cell): boolean {
        if(target.figure?.color === this.color) {
            return false; // figures of the same color can't take each other !!!
        }
        if(target.figure?.name === FigureNames.KING) {
            return false; // The King can't be taken with a figure !!!
        }
        return true;
    }

    move(target: Cell) {}

}