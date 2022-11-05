import React from 'react';

import "./box.css";

export interface Caja {
  x: number;
  y: number;
  color: string;
}

type BoxProps = {
  caja: Caja;  
}

const Box = ( {caja} : BoxProps ) =>  (
  <div className="box" style={{top: caja.y, left: caja.x, backgroundColor: caja.color }}></div>
);

export default Box;