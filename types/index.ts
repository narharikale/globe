export interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface GameScore {
  correct: number;
  incorrect: number;
}

export interface GameState {
  currentDestination: Destination | null;
  options: Destination[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  score: GameScore;
  username: string;
  isGameStarted: boolean;
  showResult: boolean;
  factToShow: string;
} 