import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const KnightComponent: FC<FigureComponentProps> = ( { color } ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9816;</span> : <span className="figureSize">&#9822;</span> }</>
  );
}

export default KnightComponent;
