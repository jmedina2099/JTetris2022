import { useContext, useEffect } from 'react';
import { ApiServiceContext } from '../../App';

import "./score.css";

const Score = () => {
  const context = useContext(ApiServiceContext);
  useEffect(() => {
    const scoreListener = (scoreCad: string) => {
      //console.log('score from rabbitmq = ' + scoreCad );
      if( context.board[0].running && !context.board[0].paused ) {
        const scoreInt = Number.parseInt(scoreCad);
        if( context.board[0].score !== scoreInt ) {
          context.board[1]( {...context.board[0], score:scoreInt} );
        }
      }
    };
    if( context.socket[0] ) context.socket[0].on('score', scoreListener);
    return () => {
      if( context.socket[0] ) context.socket[0].off('score', scoreListener);
    };
  }, [context.board,context.socket]);
  return (
    <div className="scoreLabel">{context.board[0].score}</div>
  );
}

export default Score;