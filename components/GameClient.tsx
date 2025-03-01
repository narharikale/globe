'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { ClueCard } from './organism/ClueCard';
import { OptionButton } from './organism/OptionButton';
import { ResultCard } from './organism/ResultCard';
import { ScoreDisplay } from './organism/ScoreDisplay';
import { ShareButton } from './organism/ShareButton';
import { UsernameForm } from './organism/UsernameForm';
import { GameCompletion } from './organism/GameCompletion';
import { Country } from '@/types';

const GameClient = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [localUsername, setLocalUsername] = useState('');
  
  const { 
    currentClue,
    currentClueId, 
    options, 
    selectedOption, 
    isCorrect, 
    score, 
    isGameStarted,
    showResult, 
    factToShow, 
    selectOption, 
    playAgain,
    loadNewQuestion,
    startGame,
    isGameCompleted,
    playedCountries,
    correctCountryId,
    resetGame
  } = useGameStore();

  // Initialize game data
  useEffect(() => {
    const initGameData = async () => {
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Load all countries to track progress
        await useGameStore.getState().loadAllCountries();
        
        setIsLoading(false);
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing game data:', err);
        setError('Failed to load game data. Please try again.');
        setIsLoading(false);
      }
    };
    
    initGameData();
  }, [isInitialized]);

  // Handle username submission
  const handleUsernameSubmit = async (newUsername: string) => {
    // Prevent submitting if already in progress
    if (isSubmittingUsername) return;
    
    try {
      setIsSubmittingUsername(true);
      setLocalUsername(newUsername);
      
      // Start the game without creating a user
      await startGame();
      
      setIsSubmittingUsername(false);
    } catch (err) {
      console.error('Error starting game:', err);
      setError('Failed to start game. Please try again.');
      setIsSubmittingUsername(false);
    }
  };

  // Handle starting a new game with a different user
  const handleNewGame = () => {
    setLocalUsername('');
    resetGame();
  };

  // Handle playing the same question again
  const handlePlayAgain = () => {
    // Reset the current question state without loading a new question
    useGameStore.setState({
      selectedOption: null,
      isCorrect: null,
      showResult: false,
      factToShow: ''
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Loading game...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-6 bg-red-50 rounded-lg">
        <p className="text-xl text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reload Game
        </button>
      </div>
    );
  }

  // Username input screen
  if (!isGameStarted) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <UsernameForm onSubmit={handleUsernameSubmit} isLoading={isSubmittingUsername} />
      </div>
    );
  }

  // Game completion screen
  if (isGameCompleted) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <GameCompletion 
          username={localUsername} 
          score={score}  
          onNewGame={handleNewGame} 
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <ScoreDisplay
          correct={score.correct}
          incorrect={score.incorrect}
          username={localUsername}
        />
        <ShareButton username={localUsername} score={score} />
      </div>

      {currentClue && !showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ClueCard clues={[currentClue]} />

          <h3 className="text-xl font-semibold mt-8 mb-4">
            Select the correct country:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option: Country) => (
              <OptionButton
                key={option.id}
                city={option.cities && option.cities.length > 0 ? option.cities[0].name : ''}
                country={option.name}
                selected={selectedOption === option.id}
                onClick={() => option.id && selectOption(option.id)}
                disabled={!!selectedOption}
              />
            ))}
          </div>
        </motion.div>
      )}

      {showResult && (
        <ResultCard
          isCorrect={isCorrect || false}
          factToShow={factToShow}
          destination={options.find(o => o.id === correctCountryId)?.name || ''}
          onNext={playAgain}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
};

export default GameClient; 