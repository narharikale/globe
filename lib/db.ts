import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();
export const prisma = db; // Export as prisma as well for backward compatibility

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

interface City {
  id: number;
  name: string;
  countryId: number;
}

interface Clue {
  id: number;
  text: string;
  countryId: number;
}

interface FunFact {
  id: number;
  text: string;
  countryId: number;
}

interface Trivia {
  id: number;
  text: string;
  countryId: number;
}

interface Country {
  id: number;
  name: string;
  cities: City[];
  clues: Clue[];
  funFacts: FunFact[];
  trivias: Trivia[];
}

interface GameHistory {
  id: number;
  correctCount: number;
  incorrectCount: number;
  completedAt: Date;
  countriesPlayed: { id: number }[];
}

export async function getCountries() {
  const countries = await db.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  }) as unknown as Country[];

  return countries.map((country: Country) => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map((city: City) => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map((clue: Clue) => clue.text),
    fun_fact: country.funFacts.map((fact: FunFact) => fact.text),
    trivia: country.trivias.map((trivia: Trivia) => trivia.text),
  }));
}

export async function getCountryById(id: number) {
  const country = await db.country.findUnique({
    where: { id },
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  }) as unknown as Country | null;

  if (!country) return null;

  return {
    id: country.id,
    name: country.name,
    cities: country.cities.map((city: City) => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map((clue: Clue) => clue.text),
    fun_fact: country.funFacts.map((fact: FunFact) => fact.text),
    trivia: country.trivias.map((trivia: Trivia) => trivia.text),
  };
}

export async function getRandomCountries(count: number) {
  // Get all countries
  const allCountries = await db.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  }) as unknown as Country[];

  // Shuffle the array
  const shuffled = [...allCountries].sort(() => 0.5 - Math.random());
  
  // Take the first 'count' items
  const selected = shuffled.slice(0, count);

  // Format the data
  return selected.map((country: Country) => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map((city: City) => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map((clue: Clue) => clue.text),
    fun_fact: country.funFacts.map((fact: FunFact) => fact.text),
    trivia: country.trivias.map((trivia: Trivia) => trivia.text),
  }));
}

export async function getAllCountries() {
  // Get all countries
  const allCountries = await db.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  }) as unknown as Country[];

  // Format the data
  return allCountries.map((country: Country) => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map((city: City) => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map((clue: Clue) => clue.text),
    fun_fact: country.funFacts.map((fact: FunFact) => fact.text),
    trivia: country.trivias.map((trivia: Trivia) => trivia.text),
  }));
}

export async function getRandomClues(count: number, excludeCountryIds: number[] = []) {
  // Get random clues
  const clues = await db.clue.findMany({
    where: {
      countryId: {
        notIn: excludeCountryIds
      }
    },
    take: count,
    include: {
      country: true
    }
  });

  return clues.map((clue: any) => ({
    id: clue.id,
    text: clue.text,
    countryId: clue.countryId
  }));
}

interface ClueWithCountry extends Clue {
  country: Country & {
    funFacts: FunFact[];
    trivias: Trivia[];
  };
}

export async function verifyAnswer(clueId: number, selectedCountry: string) {
  // Get the clue and its associated country
  const clue = await db.clue.findUnique({
    where: { id: clueId },
    include: {
      country: {
        include: {
          funFacts: true,
          trivias: true
        }
      }
    }
  }) as unknown as ClueWithCountry;

  if (!clue) {
    throw new Error('Clue not found');
  }

  // Check if the selected country matches the correct country
  const isCorrect = clue.country.name.toLowerCase() === selectedCountry.toLowerCase();

  // Get a random fact about the country
  const allFacts = [
    ...clue.country.funFacts.map((fact: FunFact) => fact.text),
    ...clue.country.trivias.map((trivia: Trivia) => trivia.text)
  ];

  const factToShow = allFacts.length > 0 
    ? allFacts[Math.floor(Math.random() * allFacts.length)]
    : `Interesting fact about ${clue.country.name}`;

  return {
    isCorrect,
    correctCountry: clue.country.name,
    factToShow
  };
}

export async function createAnonymousUser() {
  // Create a new user without a username
  const user = await db.user.create({
    data: {}
  });

  return user;
}

export async function saveGameResult(
  correctCount: number, 
  incorrectCount: number,
  countriesPlayed: { countryId: number, wasCorrect: boolean }[]
) {
  // Create a new anonymous user
  const user = await createAnonymousUser();
  
  // Create a new game history record
  const gameHistory = await db.gameHistory.create({
    data: {
      userId: user.id,
      correctCount,
      incorrectCount,
      countriesPlayed: {
        create: countriesPlayed
      }
    },
    include: {
      countriesPlayed: true
    }
  });

  return gameHistory;
}

export async function getUserStats(username: string) {
  const user = await db.user.findFirst({
    where: { username },
    include: {
      gameHistory: {
        include: {
          countriesPlayed: true
        }
      }
    }
  });

  if (!user) return null;

  const gameHistory = user.gameHistory as unknown as GameHistory[];

  // Calculate total stats
  const totalGames = gameHistory.length;
  const totalCorrect = gameHistory.reduce((sum: number, game) => sum + game.correctCount, 0);
  const totalIncorrect = gameHistory.reduce((sum: number, game) => sum + game.incorrectCount, 0);
  const totalCountriesPlayed = gameHistory.reduce((sum: number, game) => sum + game.countriesPlayed.length, 0);

  return {
    username: user.username,
    totalGames,
    totalCorrect,
    totalIncorrect,
    totalCountriesPlayed,
    gameHistory: gameHistory.map(game => ({
      id: game.id,
      correctCount: game.correctCount,
      incorrectCount: game.incorrectCount,
      completedAt: game.completedAt,
      countriesCount: game.countriesPlayed.length
    }))
  };
}

declare global {
  var prisma: PrismaClient | undefined;
}

type ErrorWithCode = {
  code?: string;
  message: string;
};

export function handlePrismaError(error: ErrorWithCode): { message: string; status: number } {
  console.error('Database error:', error);

  // Handle specific Prisma error codes
  switch (error.code) {
    case 'P2002':
      return {
        message: 'A unique constraint violation occurred.',
        status: 409
      };
    case 'P2025':
      return {
        message: 'Record not found.',
        status: 404
      };
    case 'P2014':
      return {
        message: 'The change you are trying to make would violate database constraints.',
        status: 400
      };
    case 'P2003':
      return {
        message: 'Foreign key constraint failed.',
        status: 400
      };
    default:
      return {
        message: 'An unexpected database error occurred.',
        status: 500
      };
  }
} 