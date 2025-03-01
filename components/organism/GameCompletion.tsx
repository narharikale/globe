'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GameScore } from '@/types';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface GameCompletionProps {
  username: string;
  score: GameScore;
  onNewGame: () => void;
}

export const GameCompletion: React.FC<GameCompletionProps> = ({
  username,
  score,
  onNewGame
}) => {
  const { width, height } = useWindowSize();
  const totalQuestions = score.correct + score.incorrect;
  const percentage = Math.round((score.correct / totalQuestions) * 100);
  
  let message = '';
  if (percentage >= 90) {
    message = 'Amazing! You&apos;re a geography expert!';
  } else if (percentage >= 70) {
    message = 'Great job! You know your geography well!';
  } else if (percentage >= 50) {
    message = 'Good effort! Keep exploring the world!';
  } else {
    message = 'Keep practicing! The world is waiting to be discovered!';
  }

  return (
    <>
      {percentage >= 70 && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          Game Complete!
        </h2>
        
        <p className="text-lg text-gray-600 mb-6">
          You&apos;ve completed all available questions! Here&apos;s how you did:
        </p>
        
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Correct Answers:</span>
            <span className="text-green-600 font-bold">{score.correct}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Incorrect Answers:</span>
            <span className="text-red-600 font-bold">{score.incorrect}</span>
          </div>
        </div>
        
        <p className="text-center text-gray-700 font-medium mb-6">
          {message}
        </p>
        
        <div className="flex flex-col space-y-3">
          
          <button
            onClick={onNewGame}
            className="w-full py-2 px-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
          >
            New Game
          </button>
        </div>
      </motion.div>
    </>
  );
}; 