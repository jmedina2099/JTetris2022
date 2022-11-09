import React, { useState, createContext, useContext, KeyboardEvent, Dispatch } from 'react';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';

import './App.css';

export const timerDefault : NodeJS.Timer = {
  hasRef: function (): boolean {
    throw new Error('Function not implemented.');
  },
  refresh: function (): NodeJS.Timer {
    throw new Error('Function not implemented.');
  },
  [Symbol.toPrimitive]: function (): number {
    throw new Error('Function not implemented.');
  },
  ref: function (): NodeJS.Timer {
    throw new Error('Function not implemented.');
  },
  unref: function (): NodeJS.Timer {
    throw new Error('Function not implemented.');
  }
}

export interface Game {
  apiService: ApiService
  handleKeyboard: (e: KeyboardEvent) => void
  running: [boolean,Dispatch<React.SetStateAction<boolean>>]
  paused: [boolean,Dispatch<React.SetStateAction<boolean>>]
  gameOver: [boolean,Dispatch<React.SetStateAction<boolean>>]
  cajas: [Caja[],Dispatch<React.SetStateAction<Caja[]>>]
  cajasCayendo: [Caja[],Dispatch<React.SetStateAction<Caja[]>>]
  intervalFetch: [NodeJS.Timer, Dispatch<React.SetStateAction<NodeJS.Timer>>]
  score: [number,Dispatch<React.SetStateAction<number>>]
}

export interface Board {
  running: boolean
  paused: boolean
  gameOver: boolean
  figuresFixed: Caja[]
  fallingFigure: Caja[]
  score: number
}

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext<Game>(
  {
    apiService: ApiServiceImpl,
    handleKeyboard: (e: KeyboardEvent) => {},
    running: [false, () => {} ],
    paused: [false, () => {} ],
    gameOver: [false, () => {}],
    cajas: [[], () => {}],
    cajasCayendo: [[], () => {}],
    intervalFetch: [timerDefault, () => {}],
    score: [0, () => {}],
  }
);

function App() {
  const context = useContext(ApiServiceContext);
  context.running = useState<boolean>(false);
  context.paused = useState<boolean>(false);
  context.gameOver = useState<boolean>(false);
  return <VentanaPrincipal/>;
}

export default App;

