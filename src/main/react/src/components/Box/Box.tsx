import React, { FC } from 'react';

import "./box.css";

export interface Caja {
  x: number;
  y: number;
  color: string;
}

const Box: FC<Caja> = ( {x,y,color} : Caja ) =>  (
  <div className='box' style={{top: y, left: x, backgroundColor: color }}></div>
);

export default Box;
