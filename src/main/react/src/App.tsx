import { Socket } from 'socket.io-client';
import React, { createContext, Dispatch } from 'react';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';

import './App.css';
import { Figura } from './components/Figure/Figure';

export interface Game {
  apiService: ApiService
  running: [boolean,Dispatch<React.SetStateAction<boolean>>]
  paused: [boolean,Dispatch<React.SetStateAction<boolean>>]
  gameOver: [boolean,Dispatch<React.SetStateAction<boolean>>]
  hash: [number,Dispatch<React.SetStateAction<number>>]
  cajas: [Caja[],Dispatch<React.SetStateAction<Caja[]>>]
  figuraCayendo: [Figura | undefined,Dispatch<React.SetStateAction<Figura | undefined>>]
  intervalFetch: [NodeJS.Timer | undefined, Dispatch<React.SetStateAction<NodeJS.Timer | undefined>>]
  score: [number,Dispatch<React.SetStateAction<number>>]
  socket: [Socket | undefined,Dispatch<React.SetStateAction<Socket | undefined>>];
}

export interface Board {
  running: boolean
  paused: boolean
  gameOver: boolean
  hash: number
  figuresFixed: Caja[]
  fallingFigure: Figura
  score: number
}

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext<Game>(
  {
    apiService: ApiServiceImpl,
    running: [false, () => {} ],
    paused: [false, () => {} ],
    gameOver: [false, () => {}],
    hash: [0, () => {}],
    cajas: [[], () => {}],
    figuraCayendo: [undefined, () => {}],
    intervalFetch: [undefined, () => {}],
    score: [0, () => {}],
    socket: [undefined, () => {}],
  }
);

function App() {
  return <VentanaPrincipal/>;
}

export default App;

