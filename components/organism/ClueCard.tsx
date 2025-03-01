import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface ClueCardProps {
  clues: string[];
}

export const ClueCard: React.FC<ClueCardProps> = ({ clues }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center mb-4">
        <MapPin className="w-6 h-6 mr-2" />
        <h2 className="text-xl font-bold">Where in the world is this?</h2>
      </div>
      
      <div className="space-y-4">
        {clues.map((clue, index) => (
          <motion.div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
          >
            <p className="text-lg">{clue}</p>
          </motion.div>
        ))}
      </div>    
    </motion.div>
  );
};