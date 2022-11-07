import React, { useEffect, useState, useContext } from 'react';
import Box from '../Box/Box';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";

import { ApiServiceContext } from '../../App'

const VentanaPrincipal = () => {
  const context = useContext(ApiServiceContext);
  const [myInterval1,setMyInterval1] = useState<NodeJS.Timer>();
  const [myInterval2,setMyInterval2] = useState<NodeJS.Timer>();
  const apiService = context.apiService;
  const running = context.running[0];
  const paused = context.paused[0];
  const setCajas = context.cajas[1];
  const setCajasCayendo = context.cajasCayendo[1];
  useEffect(() => {
    if( running && !paused ) {
      apiService.fetchFallingFigure(setCajasCayendo,setMyInterval2);
      apiService.fetchFigures(setCajas,setMyInterval1);
    }
  }, [apiService,running,paused,setCajas,setCajasCayendo]);
  if( !running || paused ) {
    if( myInterval1 ) {
      clearInterval(myInterval1);
    }
    if( myInterval2 ) {
      clearInterval(myInterval2);
    }
  }
  const cajaCayendo = context.cajasCayendo[0];
  const cajas = context.cajas[0];
  return (
    <div className="ventanaPrincipal">
      <PanelTetris>
        {cajaCayendo.map( box => {
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
