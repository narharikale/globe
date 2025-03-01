import React from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle, XCircle } from 'lucide-react';

interface ScoreDisplayProps {
  correct: number;
  incorrect: number;
  username?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  correct, 
  incorrect,
  username
}) => {
  const total = correct + incorrect;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md p-4 flex items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mr-4">
        <Award className="w-10 h-10 text-indigo-600" />
      </div>
      
      <div className="flex-1">
        {username && (
          <div className="text-sm text-gray-500 mb-1">
            Player: <span className="font-medium">{username}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="font-medium">{correct}</span>
          </div>
          
          <div className="flex items-center">
            <XCircle className="w-4 h-4 text-red-500 mr-1" />
            <span className="font-medium">{incorrect}</span>
          </div>
          
          {total > 0 && (
            <div className="text-sm font-medium">
              {percentage}% correct
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};