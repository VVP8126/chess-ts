import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const QueenComponent: FC<FigureComponentProps> = ( { color } ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9813;</span> : <span className="figureSize">&#9819;</span> }</>
  );
}

export default QueenComponent;
