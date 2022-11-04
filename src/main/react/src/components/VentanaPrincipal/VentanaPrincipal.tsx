import React, { FC, useEffect, useState } from 'react';
import Box, { Caja } from '../Box/Box';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";
import SERVERNAME from '../../servername.json'

import axios from 'axios';

export type PropsTetris = {
  running: boolean,
  paused: boolean
};

const VentanaPrincipal: FC<PropsTetris> = ( { running,paused } : PropsTetris ) => {
  const [boxes, setBoxes] = useState<Caja[]>([]);
  const [myInterval,setMyInterval] = useState<NodeJS.Timer>();
  useEffect(() => {
    if( running && !paused ) {
      const idInterval : NodeJS.Timer = setInterval(() => {
        axios
        .get<Caja[]>( SERVERNAME.address+"/figures" )
        .then( response => {
          setBoxes(response.data);
        });
      }, 500);
      setMyInterval(idInterval);
    } else {
      //clearInterval(myInterval);
    }
  }, [running,paused]);

  if( running && !paused ) {
  } else {
    clearInterval(myInterval);
  }

  return (
    <div className='ventanaPrincipal'>
      <PanelTetris>
        {boxes.map( box => {
          return <Box key={box.x+'-'+box.y} x={box.x} y={box.y} color={box.color}></Box>;
        })}
      </PanelTetris>
    </div>
  );
}

export default VentanaPrincipal;
