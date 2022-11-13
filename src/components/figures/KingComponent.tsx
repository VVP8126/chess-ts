import { FC } from "react";
import { Colors } from "../../models/colors/Color";
import { FigureComponentProps } from "./FigureComponentProps";

const KingComponent: FC<FigureComponentProps> = ( {color} ) => {
  return (
    <>{ (color === Colors.WHITE) ? <span className="figureSize">&#9812;</span> : <span className="figureSize">&#9818;</span> }</>
  );
}

export default KingComponent;
