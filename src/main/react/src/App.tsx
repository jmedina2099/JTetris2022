import React, { useState, useEffect, createContext, KeyboardEvent, useRef } from 'react';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';

import './App.css';

export interface State {
  running: boolean,
  paused: boolean
}

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext(ApiServiceImpl);

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [cajas,setCajas] = useState<Caja[]>([]);
  const [cajasCayendo,setCajasCayendo] = useState<Caja[]>([]);
  const handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !running ) {
          ApiServiceImpl.start(setRunning);
        } else {
          ApiServiceImpl.pause(setPaused,setRunning);
        }
        break;
      case "Space":
        ApiServiceImpl.space(setCajasCayendo);
        break;
      case "ArrowLeft":
        ApiServiceImpl.left(setCajasCayendo);
        break;
      case "ArrowRight":
        ApiServiceImpl.right(setCajasCayendo);
        break;
      case "ArrowUp":
        ApiServiceImpl.up(setCajasCayendo);
        break
      case "ArrowDown":
        ApiServiceImpl.down(setCajasCayendo);
        break
    }
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
      <div className="App" onKeyDown={handleKeyboard} tabIndex={0} ref={focusDiv}>
        <VentanaPrincipal state={{running,paused}}
          cajas={cajas} setCajas={setCajas}
          cajasCayendo={cajasCayendo} setCajasCayendo={setCajasCayendo}/>
      </div>
  );
}

export default App;
