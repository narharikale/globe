import { create } from 'zustand';
import { GameState, Country, PlayedCountry } from '../types';

// Client-side function to fetch all countries
const fetchAllCountries = async (): Promise<Country[]> => {
  const response = await fetch('/api/countries');
  
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  
  return response.json();
};

// Client-side function to fetch a random clue
const fetchRandomClue = async (excludeIds: number[] = []) => {
  const excludeParam = excludeIds.length > 0 ? `&exclude=${excludeIds.join(',')}` : '';
  const response = await fetch(`/api/clues/random?${excludeParam}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch random clue');
  }
  
  return response.json();
};

// Client-side function to fetch options for a question
const fetchOptions = async (countryId: number, count: number = 4) => {
  const response = await fetch(`/api/options?countryId=${countryId}&count=${count}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch options');
  }
  
  return response.json();
};

// Client-side function to verify an answer
const verifyAnswer = async (clueId: number, selectedCountryId: number) => {
  const response = await fetch('/api/verify-answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clueId, selectedCountryId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to verify answer');
  }
  
  return response.json();
};

// Client-side function to fetch facts about a country
const fetchCountryFacts = async (countryId: number) => {
  const response = await fetch(`/api/facts?countryId=${countryId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch country facts');
  }
  
  return response.json();
};

export const useGameStore = create<GameState & {
  startGame: () => Promise<void>;
  loadNewQuestion: () => Promise<void>;
  selectOption: (countryId: number) => Promise<void>;
  playAgain: () => void;
  loadAllCountries: () => Promise<void>;
  resetGame: () => void;
}>((set, get) => ({
  currentClue: null,
  currentClueId: null,
  options: [],
  selectedOption: null,
  isCorrect: null,
  score: {
    correct: 0,
    incorrect: 0,
  },
  isGameStarted: false,
  showResult: false,
  factToShow: '',
  playedCountries: [],
  allCountries: [],
  isGameCompleted: false,
  correctCountryId: null,

  startGame: async () => {
    set({ 
      isGameStarted: true,
      score: { correct: 0, incorrect: 0 },
      playedCountries: [],
      isGameCompleted: false
    });
    
    await get().loadAllCountries();
    await get().loadNewQuestion();
  },

  loadAllCountries: async () => {
    try {
      const allCountries = await fetchAllCountries();
      set({ allCountries });
    } catch (error) {
      console.error('Error loading all countries:', error);
      set({ allCountries: [] });
    }
  },

  loadNewQuestion: async () => {
    try {
      const { playedCountries } = get();
      
      // Get played country IDs to exclude
      const playedCountryIds = playedCountries.map(pc => pc.countryId);
      
      // Get a random clue
      const clue = await fetchRandomClue(playedCountryIds);
      
      if (!clue || !clue.countryId) {
        set({ isGameCompleted: true });
        return;
      }
      
      // Get options for this clue
      const options = await fetchOptions(clue.countryId);
      
      set({
        currentClue: clue.text,
        currentClueId: clue.id,
        options,
        selectedOption: null,
        isCorrect: null,
        showResult: false,
        factToShow: '',
        correctCountryId: clue.countryId
      });
    } catch (error) {
      console.error('Error loading question:', error);
      // Fallback to empty state or error state
      set({
        currentClue: null,
        currentClueId: null,
        options: [],
        selectedOption: null,
        isCorrect: null,
        showResult: false,
        factToShow: 'Error loading question. Please try again.',
        correctCountryId: null
      });
    }
  },

  selectOption: async (countryId: number) => {
    try {
      const { currentClueId, score, playedCountries, correctCountryId } = get();
      
      if (!currentClueId || !correctCountryId) return;
      
      // Verify the answer
      const result = await verifyAnswer(currentClueId, countryId);
      
      // Record this country as played
      const newPlayedCountry: PlayedCountry = {
        countryId: correctCountryId,
        wasCorrect: result.isCorrect
      };
      
      set({
        selectedOption: countryId,
        isCorrect: result.isCorrect,
        showResult: true,
        factToShow: result.factToShow,
        score: {
          correct: result.isCorrect ? score.correct + 1 : score.correct,
          incorrect: !result.isCorrect ? score.incorrect + 1 : score.incorrect,
        },
        playedCountries: [...playedCountries, newPlayedCountry]
      });
    } catch (error) {
      console.error('Error selecting option:', error);
      set({
        showResult: true,
        factToShow: 'Error verifying your answer. Please try again.'
      });
    }
  },

  playAgain: () => {
    // If the game is completed, start a new game
    if (get().isGameCompleted) {
      get().startGame();
    } else {
      // Otherwise, just load a new question
      get().loadNewQuestion();
    }
  },
  
  resetGame: () => {
    set({
      currentClue: null,
      currentClueId: null,
      options: [],
      selectedOption: null,
      isCorrect: null,
      score: {
        correct: 0,
        incorrect: 0,
      },
      isGameStarted: false,
      showResult: false,
      factToShow: '',
      playedCountries: [],
      isGameCompleted: false,
      correctCountryId: null
    });
  }
})); 