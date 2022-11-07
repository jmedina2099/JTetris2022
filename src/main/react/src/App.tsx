import React, { useState, createContext, useContext, KeyboardEvent, Dispatch } from 'react';
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
  handleKeyboard: (e: KeyboardEvent) => void,
  running: [boolean,Dispatch<React.SetStateAction<boolean>>],
  paused: [boolean,Dispatch<React.SetStateAction<boolean>>],
  cajas: [Caja[],Dispatch<React.SetStateAction<Caja[]>>],
  cajasCayendo: [Caja[],Dispatch<React.SetStateAction<Caja[]>>],
}

const ApiServiceImpl = new ApiService();
export const ApiServiceContext = createContext<Game>(
  {
    apiService: ApiServiceImpl,
    handleKeyboard: (e: KeyboardEvent) => {},
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
  return <VentanaPrincipal/>;
}

export default App;
