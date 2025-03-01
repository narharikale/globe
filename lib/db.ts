import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getCountries() {
  const countries = await prisma.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  });

  return countries.map(country => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map(city => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map(clue => clue.text),
    fun_fact: country.funFacts.map(fact => fact.text),
    trivia: country.trivias.map(trivia => trivia.text),
  }));
}

export async function getCountryById(id: number) {
  const country = await prisma.country.findUnique({
    where: { id },
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  });

  if (!country) return null;

  return {
    id: country.id,
    name: country.name,
    cities: country.cities.map(city => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map(clue => clue.text),
    fun_fact: country.funFacts.map(fact => fact.text),
    trivia: country.trivias.map(trivia => trivia.text),
  };
}

export async function getRandomCountries(count: number) {
  // Get all countries
  const allCountries = await prisma.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  });

  // Shuffle the array
  const shuffled = [...allCountries].sort(() => 0.5 - Math.random());
  
  // Take the first 'count' items
  const selected = shuffled.slice(0, count);

  // Format the data
  return selected.map(country => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map(city => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map(clue => clue.text),
    fun_fact: country.funFacts.map(fact => fact.text),
    trivia: country.trivias.map(trivia => trivia.text),
  }));
}

export async function getAllCountries() {
  // Get all countries
  const allCountries = await prisma.country.findMany({
    include: {
      cities: true,
      clues: true,
      funFacts: true,
      trivias: true,
    },
  });

  // Format the data
  return allCountries.map(country => ({
    id: country.id,
    name: country.name,
    cities: country.cities.map(city => ({
      id: city.id,
      name: city.name,
      countryId: city.countryId
    })),
    clues: country.clues.map(clue => clue.text),
    fun_fact: country.funFacts.map(fact => fact.text),
    trivia: country.trivias.map(trivia => trivia.text),
  }));
}

export async function getRandomClues(count: number, excludeCountryIds: number[] = []) {
  // Get random clues
  const clues = await prisma.clue.findMany({
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

  return clues.map(clue => ({
    id: clue.id,
    text: clue.text,
    countryId: clue.countryId
  }));
}

export async function verifyAnswer(clueId: number, selectedCountry: string) {
  // Get the clue and its associated country
  const clue = await prisma.clue.findUnique({
    where: { id: clueId },
    include: {
      country: {
        include: {
          funFacts: true,
          trivias: true
        }
      }
    }
  });

  if (!clue) {
    throw new Error('Clue not found');
  }

  // Check if the selected country matches the correct country
  const isCorrect = clue.country.name.toLowerCase() === selectedCountry.toLowerCase();

  // Get a random fact about the country
  const allFacts = [
    ...clue.country.funFacts.map(fact => fact.text),
    ...clue.country.trivias.map(trivia => trivia.text)
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
  const user = await prisma.user.create({
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
  const gameHistory = await prisma.gameHistory.create({
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
  const user = await prisma.user.findFirst({
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

  // Calculate total stats
  const totalGames = user.gameHistory.length;
  const totalCorrect = user.gameHistory.reduce((sum: number, game: any) => sum + game.correctCount, 0);
  const totalIncorrect = user.gameHistory.reduce((sum: number, game: any) => sum + game.incorrectCount, 0);
  const totalCountriesPlayed = user.gameHistory.reduce((sum: number, game: any) => sum + game.countriesPlayed.length, 0);

  return {
    username: user.username,
    totalGames,
    totalCorrect,
    totalIncorrect,
    totalCountriesPlayed,
    gameHistory: user.gameHistory.map((game: any) => ({
      id: game.id,
      correctCount: game.correctCount,
      incorrectCount: game.incorrectCount,
      completedAt: game.completedAt,
      countriesCount: game.countriesPlayed.length
    }))
  };
} 