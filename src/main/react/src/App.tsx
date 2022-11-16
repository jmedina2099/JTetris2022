import React, { createContext, Dispatch, useContext,KeyboardEvent } from 'react';
import { Socket } from 'socket.io-client';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';
import { Figura } from './components/Figure/Figure';

import './App.css';

export interface Game {
  apiService: ApiService
  board: [Board,Dispatch<React.SetStateAction<Board>>]
  intervalFetch: [NodeJS.Timer | undefined, Dispatch<React.SetStateAction<NodeJS.Timer | undefined>>]
  socket: [Socket | undefined,Dispatch<React.SetStateAction<Socket | undefined>>];
}

export interface Board {
  running: boolean
  paused: boolean
  gameOver: boolean
  hash: number
  figuresFixed: Caja[]
  fallingFigure: Figura | undefined
  score: number
}

export const initialBoard: Board = {
  running:false, paused:false, gameOver:false, fallingFigure:undefined, figuresFixed:[], score:0, hash:0
};

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext<Game>(
  {
    apiService: ApiServiceImpl,
    board: [initialBoard, () => {}],
    intervalFetch: [undefined, () => {}],
    socket: [undefined, () => {}],
  }
);

function App() {
  const context = useContext(ApiServiceContext);
  const apiService = context.apiService;
  const handleKeyboard = (e: KeyboardEvent): void => {
      switch (e.code) {
        case "Enter":
          if( !context.board[0].running ) {
            apiService.start(context);
          } else {
            apiService.pause(context);
          }
          break;
        case "Space":
          apiService.space(context);
          break;
        case "ArrowLeft":
          apiService.left(context);
          break;
        case "ArrowRight":
          apiService.right(context);
          break;
        case "ArrowUp":
          apiService.up(context);
          break
        case "ArrowDown":
          apiService.down(context);
          break
      }
    }
  return <VentanaPrincipal handleKeyboard={handleKeyboard}/>;
}

export default App;

