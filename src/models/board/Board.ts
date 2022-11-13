import { Colors } from "../colors/Color";
import { Bishop } from "../figures/Bishop";
import { Figure } from "../figures/Figure";
import { King }   from "../figures/King";
import { Knight } from "../figures/Knight";
import { Pawn }   from "../figures/Pawn";
import { Queen }  from "../figures/Queen";
import { Rook }   from "../figures/Rook";
import { Cell }   from "./Cell";

export class Board {
    cells: Cell[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];

    public initCells() {
        let i,j;
        for (i = 0; i < 8; i++) {
            const row: Cell[] = [];
            for (j = 0; j < 8; j++) {
                if((i + j) % 2 !== 0) {
                    row.push(new Cell(this, j, i, Colors.BLACK, null, j + i * 8)); // black
                } else {
                    row.push(new Cell(this, j, i, Colors.WHITE, null, j + i * 8));
                }
            }
            this.cells.push(row);
        }
    }

    public arrangeChessboard() {

        new Rook(Colors.WHITE,   this.getCell(0,7));
        new Knight(Colors.WHITE, this.getCell(1,7));
        new Bishop(Colors.WHITE, this.getCell(2,7));
        new Queen(Colors.WHITE,  this.getCell(3,7));
        new King(Colors.WHITE,   this.getCell(4,7));
        new Bishop(Colors.WHITE, this.getCell(5,7));
        new Knight(Colors.WHITE, this.getCell(6,7));
        new Rook(Colors.WHITE,   this.getCell(7,7));

        new Rook(Colors.BLACK,   this.getCell(0,0));
        new Knight(Colors.BLACK, this.getCell(1,0));
        new Bishop(Colors.BLACK, this.getCell(2,0));
        new Queen(Colors.BLACK,  this.getCell(3,0));
        new King(Colors.BLACK,   this.getCell(4,0));
        new Bishop(Colors.BLACK, this.getCell(5,0));
        new Knight(Colors.BLACK, this.getCell(6,0));
        new Rook(Colors.BLACK,   this.getCell(7,0));
        
        let i = 0;
        while(i < 8) {
            new Pawn(Colors.BLACK, this.getCell(i,1));
            new Pawn(Colors.WHITE, this.getCell(i++,6));
        }

    }

    public getCell(x: number, y: number) {
        return this.cells[y][x];
    }

    public highlightCells(selectedCell:Cell | null) {
        let i,j;
        for (i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (j = 0; j < row.length; j++) {
                const target = row[j];
                target.available = !!selectedCell?.figure?.isMoveble(target);
            }
        }
    }

    public getBoardCopy(): Board {
        const newBoard = new Board();
        newBoard.cells = this.cells;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        return newBoard;
    }

}
