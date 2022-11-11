import { useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { ApiServiceContext } from '../../App';
import Score from '../Score/Score';

import "./panelLateral.css";

const PanelLateral = () => {
  const context = useContext(ApiServiceContext);
  context.socket = useState<Socket>();
  const setSocket = context.socket[1];
  useEffect( () => {
    const newSocket = io('http://localhost:4000',{
      reconnection: false
    });
    newSocket.on('connect_error', err =>  {})
    newSocket.on('connect_failed', err => {})
    newSocket.on('disconnect', err => {})
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);
  return (
    <div className="panelLateral">
      <div className="score">
        <Score/>
      </div>
    </div>
  );
  }

export default PanelLateral;