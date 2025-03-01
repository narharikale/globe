import React from 'react';
import { motion } from 'framer-motion';

interface OptionButtonProps {
  city: string;
  country: string;
  selected: boolean;
  correct?: boolean | null;
  onClick: () => void;
  disabled?: boolean;
  revealed?: boolean;
}

export const OptionButton: React.FC<OptionButtonProps> = ({
  city,
  country,
  selected,
  correct,
  onClick,
  disabled = false,
  revealed = false,
}) => {
  let bgColor = 'bg-white';
  let borderColor = 'border-gray-200';
  
  if (revealed) {
    if (correct === true && selected) {
      bgColor = 'bg-green-50';
      borderColor = 'border-green-500';
    } else if (correct === false && selected) {
      bgColor = 'bg-red-50';
      borderColor = 'border-red-500';
    } else if (correct === false && !selected) {
      // This is the correct answer when user selected wrong
      bgColor = 'bg-green-50';
      borderColor = 'border-green-500';
    }
  } else if (selected) {
    bgColor = 'bg-indigo-50';
    borderColor = 'border-indigo-500';
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`w-full ${bgColor} border-2 ${borderColor} rounded-lg p-4 text-left transition-all duration-200 ${
        disabled ? 'cursor-not-allowed opacity-70' : 'hover:border-indigo-400 hover:bg-indigo-50'
      }`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{city}</span>
        <span className="text-sm text-gray-500">{country}</span>
      </div>
    </motion.button>
  );
};