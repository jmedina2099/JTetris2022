import React, { useState, useEffect, createContext, useContext, KeyboardEvent, useRef, Dispatch } from 'react';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';

import './App.css';

export interface State {
  running: boolean,
  paused: boolean
}

export interface Game {
  apiService: ApiService,
  running: [boolean,Dispatch<React.SetStateAction<boolean>>],
  paused: [boolean,Dispatch<React.SetStateAction<boolean>>],
  cajas: [Caja[],Dispatch<React.SetStateAction<Caja[]>>],
  cajasCayendo: [Caja[],Dispatch<React.SetStateAction<Caja[]>>],
}

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext<Game>(
  {
    apiService: ApiServiceImpl,
    running: [false, () => {} ],
    paused: [false, () => {} ],
    cajas: [[], () => {}],
    cajasCayendo: [[], () => {}],
  }
);

function App() {
  const context = useContext(ApiServiceContext);
  context.running = useState<boolean>(false);
  context.paused = useState<boolean>(false);
  context.cajas = useState<Caja[]>([]);
  context.cajasCayendo = useState<Caja[]>([]);
  const handleKeyboard = (e: KeyboardEvent): void => {
    switch (e.code) {
      case "Enter":
        if( !context.running[0] ) {
          ApiServiceImpl.start(context.running[1],context.paused[1]);
        } else {
          ApiServiceImpl.pause(context.paused[1],context.running[1]);
        }
        break;
      case "Space":
        ApiServiceImpl.space(context.cajasCayendo[1]);
        break;
      case "ArrowLeft":
        ApiServiceImpl.left(context.cajasCayendo[1]);
        break;
      case "ArrowRight":
        ApiServiceImpl.right(context.cajasCayendo[1]);
        break;
      case "ArrowUp":
        ApiServiceImpl.up(context.cajasCayendo[1]);
        break
      case "ArrowDown":
        ApiServiceImpl.down(context.cajasCayendo[1]);
        break
    }
  }
  const focusDiv : React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(focusDiv.current) focusDiv.current.focus(); 
   }, [focusDiv]);
  return (
      <div className="App" onKeyDown={handleKeyboard} tabIndex={0} ref={focusDiv}>
        <VentanaPrincipal/>
      </div>
  );
}

export default App;
