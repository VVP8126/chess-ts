import { Colors } from "../colors/Color";
import { Figure, FigureNames } from "../figures/Figure";
import { Queen } from "../figures/Queen";
import { Board } from "./Board";

export class Cell {

    readonly x: number;
    readonly y: number;
    readonly color: Colors = Colors.BLACK;
    figure: Figure | null;
    board: Board;
    available: boolean;
    id: number;

    constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null, id: number) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.figure = figure;
        this.board = board;
        this.available = false;
        this.id = id;
    }

    setFigure(figure: Figure) {
        this.figure = figure;
        this.figure.cell = this;
        const border = figure.color === Colors.WHITE ? 0 : 7;
        if(figure.name === FigureNames.PAWN && this.y === border) {
            console.log("Pawn reached an edge of board: x=" + this.x + ", y=" + this.y);
            const newFigure = new Queen(figure.color, this.figure.cell);
        }
    }

    addLostFigure(figure: Figure) {
        figure.color === Colors.BLACK 
            ? this.board.lostBlackFigures.push(figure)
            : this.board.lostWhiteFigures.push(figure);
    }

    moveFigure(target: Cell) {
        if(this.figure && this.figure?.isMoveble(target)) {
            this.figure?.move(target);
            if(target.figure) {
                this.addLostFigure(target.figure);
            }
            target.setFigure(this.figure);
            this.figure = null;
            // change this method to replace a pawn for a figure
        }
    }

    isEmpty(): boolean {
        return this.figure === null;
    }

    isEmptyVertical(target: Cell): boolean {
        if(this.x !== target.x) {
            return false;
        }
        const min = Math.min(this.y, target.y);
        const max = Math.max(this.y, target.y);
        for (let y = min + 1; y < max; y++) {
            if(!this.board.getCell(this.x, y).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    isEmptyHorizontal(target: Cell): boolean {
        if(this.y !== target.y) {
            return false;
        }
        const min = Math.min(this.x, target.x);
        const max = Math.max(this.x, target.x);
        for (let x = min + 1; x < max; x++) {
            if(!this.board.getCell(x, this.y).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    isEmptyDiagonal(target: Cell): boolean {
        const absX = Math.abs(target.x - this.x);
        const absY = Math.abs(target.y - this.y);
        if(absX !== absY) {
            return false;
        }
        const dy = this.y < target.y ? 1: -1;
        const dx = this.x < target.x ? 1: -1;
        let i = 1;
        while(i < absY) {
            if(!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
                return false;
            }
            i++;
        }
        return true;
    }

    isEnemy(target: Cell): boolean {  // Check for enemy by color
        if(target.figure) {
            return this.figure?.color !== target.figure?.color;
        }
        return false;
    }

    isCellProtected(): boolean { // Check if a cell is protected with enemy figures (pawns)
        return false;
    }

}
