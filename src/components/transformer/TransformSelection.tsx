import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureNames } from "../../models/figures/names/FigureNames";
import BishopComponent from "../figures/BishopComponent";
import KnightComponent from "../figures/KnightComponent";
import QueenComponent from "../figures/QueenComponent";
import RookComponent from "../figures/RookComponent";

interface TransformSelectionProps {
  color: Colors;
  onClick: (fanme: FigureNames) => void;
}

const TransformSelection: FC<TransformSelectionProps> = ( { color, onClick } ) => {
  return (
    <div className="transformSelectionBlock" >
      <h3 className="centered topmargined180">Select Figure to transform</h3>
      <div className="topmargined figureSelectRow">
        <div className="column">
          <QueenComponent  color={color} />
          <button className="selectFigureBtn" onClick={() => onClick(FigureNames.QUEEN)}>QWEEN</button>
        </div>
        <div className="column">
          <RookComponent color={color} />
          <button className="selectFigureBtn" onClick={() => onClick(FigureNames.ROOK)}>ROOK</button>
        </div>
        <div className="column">
          <BishopComponent color={color} />
          <button className="selectFigureBtn" onClick={() => onClick(FigureNames.BISHOP)}>BISHOP</button>
        </div>
        <div className="column">
          <KnightComponent color={color} />
          <button className="selectFigureBtn" onClick={() => onClick(FigureNames.KNIGHT)}>KNIGHT</button>
        </div>
      </div>
    </div>
  );
}
export default TransformSelection;
