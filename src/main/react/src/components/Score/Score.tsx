import { useContext, useEffect, useState } from 'react';
import { ApiServiceContext } from '../../App';

import "./score.css";

const Score = () => {
  const context = useContext(ApiServiceContext);
  const apiService = context.apiService;
  context.score = useState<number>(0);
  const score = context.score[0];
  const setScore = context.score[1];
  const socket = context.socket[0];
  useEffect(() => {
    const scoreListener = (score: number) => {
      console.log('score from rabbitmq = ' + score)
      setScore(score);
    };
    const boardListener = (board: string) => {
      const newBoard = JSON.parse(board);
      console.log('board from rabbitmq = ' + newBoard );
      apiService.setBoard(context,newBoard,[]);
    };
    if( socket ) socket.on('score', scoreListener);
    if( socket ) socket.on('board', boardListener);
    return () => {
      if( socket ) socket.off('score', scoreListener);
      if( socket ) socket.off('board', boardListener);
    };
  }, [context,apiService,socket,setScore]);

  return (
    <div className="scoreLabel">{score}</div>
  );
}

export default Score;