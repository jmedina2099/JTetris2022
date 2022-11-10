import { useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ApiServiceContext } from '../../App';

import "./score.css";

interface ScoreProps {
    socket: Socket
}

const Score = ( props : ScoreProps ) => {

    const context = useContext(ApiServiceContext);
    context.score = useState<number>(0);
  
    useEffect(() => {
        const scoreListener = (score: number) => {
            console.log( 'score from rabbitmq = '+score )
            context.score[1](score);
          };
        props.socket.on('message', scoreListener);
        return () => {
            props.socket.off('message', scoreListener);
        };
      }, [context,props.socket]);

  return (
    <div className="scoreLabel">{props.socket? context.score[0]: ""}</div>
  );
  }

export default Score;