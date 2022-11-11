import { useContext, useEffect, useState } from 'react';
import { ApiServiceContext } from '../../App';

import "./score.css";

const Score = () => {
  const context = useContext(ApiServiceContext);
  context.score = useState<number>(0);
  const score = context.score[0];
  const setScore = context.score[1];
  const socket = context.socket[0];
  useEffect(() => {
    const scoreListener = (score: number) => {
      console.log('score from rabbitmq = ' + score)
      setScore(score);
    };
    if( socket ) socket.on('message', scoreListener);
    return () => {
      if( socket ) socket.off('message', scoreListener);
    };
  }, [socket,setScore]);

  return (
    <div className="scoreLabel">{score}</div>
  );
}

export default Score;