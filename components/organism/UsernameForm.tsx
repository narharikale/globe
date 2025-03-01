import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface UsernameFormProps {
  onSubmit: (username: string) => void;
}

export const UsernameForm: React.FC<UsernameFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    onSubmit(username);
  };
  
  return (
    <Card className="max-w-md w-full mx-auto">
      <div className="flex justify-center mb-6">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
        >
          <Globe className="w-16 h-16 text-indigo-600" />
        </motion.div>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">
        Welcome to Globetrotter Challenge!
      </h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Choose a username to get started
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your username"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <Button type="submit" fullWidth size="lg">
          Start Playing
        </Button>
      </form>
    </Card>
  );
};