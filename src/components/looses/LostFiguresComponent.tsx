import { FC } from "react";
import { Figure, FigureNames } from "../../models/figures/Figure";
import BishopComponent from "../figures/BishopComponent";
import KnightComponent from "../figures/KnightComponent";
import PawnComponent from "../figures/PawnComponent";
import QueenComponent from "../figures/QueenComponent";
import RookComponent from "../figures/RookComponent";

interface LostFiguresComponentProps {
    title: string;
    figures: Figure[];
}

const LostFiguresComponent:FC<LostFiguresComponentProps> = ({ title, figures }) => {
    
    return (
        <div>
            <h3 className="centered topmargined">{title}</h3>
            { figures.length === 0 && <p>No losses</p> }
            <div style={{display:"flex", flexWrap:"wrap"}}>
              { figures.map(
                figure => 
                <div key={figure.id}>
                    { figure.name === FigureNames.QUEEN && <QueenComponent color={figure.color} />}
                    { figure.name === FigureNames.BISHOP && <BishopComponent color={figure.color} />}
                    { figure.name === FigureNames.KNIGHT && <KnightComponent color={figure.color} />}
                    { figure.name === FigureNames.ROOK && <RookComponent color={figure.color} />}
                    { figure.name === FigureNames.PAWN && <PawnComponent color={figure.color} />},
                </div>
              )}
            </div>
        </div>
    );
}
export default LostFiguresComponent;
