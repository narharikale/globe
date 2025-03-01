export interface Country {
  id?: number;
  name: string;
  cities?: City[];
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface Destination {
  city: string;
  country: string;
  city_id?: number;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface City {
  id?: number;
  name: string;
  countryId: number;
}

export interface GameScore {
  correct: number;
  incorrect: number;
}

export interface GameState {
  currentClue: string | null;
  currentClueId: number | null;
  options: Country[];
  selectedOption: number | null;
  isCorrect: boolean | null;
  score: GameScore;
  isGameStarted: boolean;
  showResult: boolean;
  factToShow: string;
  playedCountries: PlayedCountry[];
  allCountries: Country[];
  isGameCompleted: boolean;
  correctCountryId: number | null;
}

export interface PlayedCountry {
  countryId: number;
  wasCorrect: boolean;
}

export interface User {
  id: number;
  username?: string;
}

export interface GameHistory {
  id: number;
  userId: number;
  correctCount: number;
  incorrectCount: number;
  completedAt: string;
  countriesPlayed: CountryPlayed[];
}

export interface CountryPlayed {
  id: number;
  gameHistoryId: number;
  countryId: number;
  wasCorrect: boolean;
}

export interface UserStats {
  username?: string;
  totalGames: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalCountriesPlayed: number;
  gameHistory: {
    id: number;
    correctCount: number;
    incorrectCount: number;
    completedAt: string;
    countriesCount: number;
  }[];
}

export interface VerifyAnswerRequest {
  clueId: number;
  selectedCountryId: number;
}

export interface VerifyAnswerResponse {
  isCorrect: boolean;
  correctCountryId: number;
  correctCountryName: string;
  factToShow: string;
} 