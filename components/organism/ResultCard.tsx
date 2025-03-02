import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from './Button';

interface ResultCardProps {
  isCorrect: boolean;
  factToShow: string;
  destination: string;
  onNext: () => void;
  onPlayAgain?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  isCorrect,
  factToShow,
  destination,
  onNext,
  onPlayAgain,
}) => {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isCorrect && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}
      <motion.div
        className={`rounded-xl shadow-lg p-6 ${
          isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col items-center text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          >
            {isCorrect ? (
              <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500 mb-2" />
            )}  
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-1">
            {isCorrect ? 'Correct!' : 'Not quite right!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {isCorrect 
              ? `You nailed it! ${destination} is the answer.` 
              : null}
          </p>
          
          <div className="bg-white rounded-lg p-4 w-full mb-6">
            <h3 className="font-semibold text-lg mb-2">Fun Fact:</h3>
            <p className="text-gray-700">{factToShow}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {!isCorrect && onPlayAgain && (
              <Button onClick={onPlayAgain} variant="secondary">
                Play Again
              </Button>
            )}
            <Button onClick={onNext} variant={isCorrect ? 'secondary' : 'primary'}>
              Next Destination
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
};