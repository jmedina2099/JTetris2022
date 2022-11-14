import { useContext, useEffect, useState } from 'react';
import { ApiServiceContext } from '../../App';

import "./score.css";

const Score = () => {
  const context = useContext(ApiServiceContext);
  const apiService = context.apiService;
  const socket = context.socket[0];
  const [score,setScore] = context.score = useState<number>(0);
  useEffect(() => {
    const scoreListener = (scoreCad: string) => {
      console.log('score from rabbitmq = ' + scoreCad)
      const score = Number.parseInt(scoreCad);
      setScore(score);
    };
    if( socket ) socket.on('score', scoreListener);
    return () => {
      if( socket ) socket.off('score', scoreListener);
    };
  }, [context,apiService,socket,setScore]);

  return (
    <div className="scoreLabel">{score}</div>
  );
}

export default Score;