import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import './App.css';

import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import SERVERNAME from './servername.json'

import axios from 'axios';

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
            setRunning(response.data);
          });
        } else {
          axios
          .get<boolean>( SERVERNAME.address+"/pause" )
          .then( response => {
            setPaused(response.data);
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
      <VentanaPrincipal running={running} paused={paused}/>
    </div>
  );
}

export default App;
