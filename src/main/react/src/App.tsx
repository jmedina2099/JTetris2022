import { Socket } from 'socket.io-client';
import React, { useState, createContext, useContext, KeyboardEvent, Dispatch } from 'react';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';

import './App.css';

export interface Game {
  apiService: ApiService
  handleKeyboard: (e: KeyboardEvent) => void
  running: [boolean,Dispatch<React.SetStateAction<boolean>>]
  paused: [boolean,Dispatch<React.SetStateAction<boolean>>]
  gameOver: [boolean,Dispatch<React.SetStateAction<boolean>>]
  cajas: [Caja[],Dispatch<React.SetStateAction<Caja[]>>]
  cajasCayendo: [Caja[],Dispatch<React.SetStateAction<Caja[]>>]
  intervalFetch: [NodeJS.Timer | undefined, Dispatch<React.SetStateAction<NodeJS.Timer | undefined>>]
  score: [number,Dispatch<React.SetStateAction<number>>]
  socket: [Socket | undefined,Dispatch<React.SetStateAction<Socket | undefined>>];
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
    intervalFetch: [undefined, () => {}],
    score: [0, () => {}],
    socket: [undefined, () => {}],
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

