import React, { useEffect, useState, useContext } from 'react';
import Box, { Caja } from '../Box/Box';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";

import { State } from '../../App';

import { ApiServiceContext } from '../../App'

type PropsTetris = {
  cajas: Caja[],
  setCajas: Function,
  cajasCayendo: Caja[],
  setCajasCayendo: Function,
  state: State,
};

const VentanaPrincipal = ( { cajas, setCajas, cajasCayendo, setCajasCayendo, state } : PropsTetris ) => {
  const ApiServiceImpl = useContext(ApiServiceContext);
  const [myInterval1,setMyInterval1] = useState<NodeJS.Timer>();
  const [myInterval2,setMyInterval2] = useState<NodeJS.Timer>();
  useEffect(() => {
    if( state.running && !state.paused ) {
      ApiServiceImpl.fetchFallingFigure(setCajasCayendo,setMyInterval2);
      ApiServiceImpl.fetchFigures(setCajas,setMyInterval1);
    }
  }, [state.running,state.paused,ApiServiceImpl,setCajas,setCajasCayendo]);
  if( !state.running || state.paused ) {
    if( myInterval1 ) {
      clearInterval(myInterval1);
    }
    if( myInterval2 ) {
      clearInterval(myInterval2);
    }
  }
  return (
    <div className="ventanaPrincipal">
      <PanelTetris>
        {cajasCayendo.map( box => {
          return <Box key={box.x+"-"+box.y} caja={box}/>;
        })}
        {cajas.map( box => {
          return <Box key={box.x+"-"+box.y} caja={box}/>;
        })}
      </PanelTetris>
    </div>
  );
}

export default VentanaPrincipal;
