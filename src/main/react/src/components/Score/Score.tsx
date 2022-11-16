import { useContext, useEffect } from 'react';
import { ApiServiceContext } from '../../App';

import "./score.css";

const Score = () => {
  const context = useContext(ApiServiceContext);
  const [board,setBoard] = context.board;
  const socket = context.socket[0];
  useEffect(() => {
    const scoreListener = (scoreCad: string) => {
      console.log('score from rabbitmq = ' + scoreCad );
      if( board.running && !board.paused ) {
        const score = Number.parseInt(scoreCad);
        setBoard( {...board, score:score} );
      }
    };
    if( socket ) socket.on('score', scoreListener);
    return () => {
      if( socket ) socket.off('score', scoreListener);
    };
  }, [board,setBoard,socket]);
  return (
    <div className="scoreLabel">{context.board[0].score}</div>
  );
}

export default Score;