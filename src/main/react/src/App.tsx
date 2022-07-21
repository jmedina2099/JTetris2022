import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';

import axios from 'axios';

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !running ) {
          axios
          .get<boolean>( "http://localhost:8080/start" )
          .then( response => {
            setRunning(response.data);
          });
        } else {
          axios
          .get<boolean>( "http://localhost:8080/pause" )
          .then( response => {
            setPaused(response.data);
          });
        }
        break;
      case "Space":
        axios.get<boolean>( "http://localhost:8080/space" );
        break;
      case "ArrowLeft":
        axios.get<boolean>( "http://localhost:8080/left" );
        break;
      case "ArrowRight":
        axios.get<boolean>( "http://localhost:8080/right" );
        break;
      case "ArrowUp":
        axios.get<boolean>( "http://localhost:8080/up" );
        break
      case "ArrowDown":
        axios.get<boolean>( "http://localhost:8080/down" );
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
