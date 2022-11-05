import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import './App.css';

import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import SERVERNAME from './servername.json'

import axios from 'axios';

export interface State {
  running: boolean,
  paused: boolean
}

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !running ) {
          axios
          .get<boolean>( SERVERNAME.address+"/start" )
          .then( response => {
            if( response && typeof response.data === "boolean" ) {
              setRunning(response.data);
            }
          })
          .catch( (error) => {
            setRunning(false);
          });
        } else {
          axios
          .get<boolean>( SERVERNAME.address+"/pause" )
          .then( response => {
            if( response && typeof response.data === "boolean" ) {
              setPaused(response.data);
            }
          })
          .catch( (error) => {
            setRunning(false);
          });
        }
        break;
      case "Space":
        axios.get<boolean>( SERVERNAME.address+"/space" );
        break;
      case "ArrowLeft":
        axios.get<boolean>( SERVERNAME.address+"/left" );
        break;
      case "ArrowRight":
        axios.get<boolean>( SERVERNAME.address+"/right" );
        break;
      case "ArrowUp":
        axios.get<boolean>( SERVERNAME.address+"/up" );
        break
      case "ArrowDown":
        axios.get<boolean>( SERVERNAME.address+"/down" );
        break
    }
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
    <div className="App" onKeyDown={handleKeyboard} tabIndex={0} ref={focusDiv}>
      <VentanaPrincipal state={{running,paused}}/>
    </div>
  );
}

export default App;
