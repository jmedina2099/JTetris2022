import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Score from '../Score/Score';

import "./panelLateral.css";

const PanelLateral = () => {
  const [socket, setSocket] = useState<Socket>();
  useEffect( () => {
    const newSocket = io(`http://localhost:4000`);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [setSocket]);
  return (
    <div className="panelLateral">
      <div className="score">
          {socket? <Score socket={socket}/>: "" }
      </div>
    </div>
  );
  }

export default PanelLateral;