import React, { FC } from 'react';

import "./panelTetris.css";

type PropsTetris = {
  children?: React.ReactNode;
}

const PanelTetris: FC<PropsTetris> = ( {children} : PropsTetris ) => (
  <div className='panelTetris'>
    {children}
  </div>
);

export default PanelTetris;
