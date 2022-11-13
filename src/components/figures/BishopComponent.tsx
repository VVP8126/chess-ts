import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const BishopComponent: FC<FigureComponentProps> = ( { color } ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9815;</span> : <span className="figureSize">&#9821;</span> }</>
  );
}

export default BishopComponent;
