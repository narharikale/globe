import { create } from 'zustand';
import { GameState, Destination } from '@/types';
import { mockDestinations } from '../../data/mockDestinations';

// In a real app, this would be fetched from an API
const getRandomDestinations = (count: number): Destination[] => {
  const shuffled = [...mockDestinations].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomFact = (destination: Destination): string => {
  const allFacts = [...destination.fun_fact, ...destination.trivia];
  return allFacts[Math.floor(Math.random() * allFacts.length)];
};

export const useGameStore = create<GameState & {
  startGame: (username: string) => void;
  loadNewQuestion: () => void;
  selectOption: (cityName: string) => void;
  playAgain: () => void;
}>((set, get) => ({
  currentDestination: null,
  options: [],
  selectedOption: null,
  isCorrect: null,
  score: {
    correct: 0,
    incorrect: 0,
  },
  username: '',
  isGameStarted: false,
  showResult: false,
  factToShow: '',

  startGame: (username: string) => {
    set({ 
      username,
      isGameStarted: true,
      score: { correct: 0, incorrect: 0 }
    });
    get().loadNewQuestion();
  },

  loadNewQuestion: () => {
    const options = getRandomDestinations(4);
    const currentDestination = options[Math.floor(Math.random() * options.length)];
    
    set({
      currentDestination,
      options,
      selectedOption: null,
      isCorrect: null,
      showResult: false,
      factToShow: ''
    });
  },

  selectOption: (cityName: string) => {
    const { currentDestination, score } = get();
    
    if (!currentDestination) return;
    
    const isCorrect = cityName === currentDestination.city;
    const factToShow = getRandomFact(currentDestination);
    
    set({
      selectedOption: cityName,
      isCorrect,
      showResult: true,
      factToShow,
      score: {
        correct: isCorrect ? score.correct + 1 : score.correct,
        incorrect: !isCorrect ? score.incorrect + 1 : score.incorrect,
      }
    });
  },

  playAgain: () => {
    get().loadNewQuestion();
  }
})); 