import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const PawnComponent: FC<FigureComponentProps> = ( { color } ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9817;</span> : <span className="figureSize">&#9823;</span> }</>
  );
}

export default PawnComponent;
