import React, { useEffect, useState } from 'react';
import Box, { Caja } from '../Box/Box';
import PanelTetris from '../PanelTetris/PanelTetris';

import "./ventanaPrincipal.css";
import SERVERNAME from '../../servername.json'

import axios from 'axios';
import { State } from '../../App';

type PropsTetris = {
  state: State,
};

const VentanaPrincipal = ( { state } : PropsTetris ) => {
  const [boxes, setBoxes] = useState<Caja[]>([]);
  const [myInterval,setMyInterval] = useState<NodeJS.Timer>();
  useEffect(() => {
    if( state.running && !state.paused ) {
      const idInterval : NodeJS.Timer = setInterval(() => {
        axios
        .get<Caja[]>( SERVERNAME.address+"/figures" )
        .then( response => {
          if( response && response.data ) {
            setBoxes(response.data);
          } else {
            clearInterval(idInterval);
          }
        })
        .catch( (error) => {
          clearInterval(idInterval);
          setBoxes([]);
        });
      }, 500);
      setMyInterval(idInterval);
    }
  }, [state.running,state.paused]);
  if( !state.running || state.paused ) {
    if( myInterval ) {
      clearInterval(myInterval);
    }
  }
  return (
    <div className="ventanaPrincipal">
      <PanelTetris>
        {boxes.map( box => {
          return <Box key={box.x+"-"+box.y} caja={box}/>;
        })}
      </PanelTetris>
    </div>
  );
}

export default VentanaPrincipal;
