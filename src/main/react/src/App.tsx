import React, { createContext, Dispatch, useContext,KeyboardEvent, useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { Caja } from './components/Box/Box';
import VentanaPrincipal from './components/VentanaPrincipal/VentanaPrincipal';
import ApiService from './service/ApiService';
import { Figura } from './components/Figure/Figure';

import SERVERNAME from './servername.json'

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
  hash: number | undefined
  figuresFixed: Caja[]
  fallingFigure: Figura | undefined
  score: number
}

export const initialBoard: Board = {
  running:false, paused:false, gameOver:false, fallingFigure:undefined, figuresFixed:[], score:0, hash:undefined
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
  context.socket = useState<Socket>();
  const setSocket = context.socket[1];
  useEffect( () => {
    const newSocket = io( SERVERNAME.node_rabbitmq_address ,{
      reconnection: true
    });
    newSocket.on('connect_error', err =>  {})
    newSocket.on('connect_failed', err => {})
    newSocket.on('disconnect', err => {})
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);
  const handleKeyboard = (e: KeyboardEvent): void => {
      switch (e.code) {
        case "Enter":
          if( !context.board[0].running ) {
            context.apiService.start(context);
          } else {
            context.apiService.pause(context);
          }
          break;
        case "Space":
          context.apiService.space(context);
          break;
        case "ArrowLeft":
          context.apiService.left(context);
          break;
        case "ArrowRight":
          context.apiService.right(context);
          break;
        case "ArrowUp":
          context.apiService.up(context);
          break
        case "ArrowDown":
          context.apiService.down(context);
          break
      }
    }
  return <VentanaPrincipal handleKeyboard={handleKeyboard}/>;
}

export default App;

