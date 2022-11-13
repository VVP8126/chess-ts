import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const RookComponent: FC<FigureComponentProps> = ( { color } ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9814;</span> : <span className="figureSize">&#9820;</span> }</>
  );
}

export default RookComponent;
