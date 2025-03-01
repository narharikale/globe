const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mockDestinations = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is known as the 'City of Light'",
      "It has a famous iron tower built for a World's Fair",
      "It's home to the Louvre museum"
    ],
    fun_fact: [
      "There is only one stop sign in this entire city",
      "This city has a smaller replica of the Statue of Liberty"
    ],
    trivia: [
      "This city has over 470 parks and gardens",
      "The main river flowing through this city is the Seine"
    ]
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city is the most populous metropolitan area in the world",
      "It hosted the Summer Olympics twice",
      "It's famous for its cherry blossom season"
    ],
    fun_fact: [
      "This city has over 200 miles of underground shopping malls",
      "It has more Michelin-starred restaurants than any other city"
    ],
    trivia: [
      "This city was formerly known as Edo",
      "The city's metro system carries over 3 billion passengers annually"
    ]
  },
  {
    city: "New York",
    country: "United States",
    clues: [
      "This city is nicknamed 'The Big Apple'",
      "It has a famous statue in its harbor",
      "It's home to Central Park"
    ],
    fun_fact: [
      "This city's public library has over 50 million items",
      "The city's subway system has 472 stations"
    ],
    trivia: [
      "This city was briefly the capital of the United States",
      "The city consists of five boroughs"
    ]
  },
  {
    city: "Cairo",
    country: "Egypt",
    clues: [
      "This city is located near ancient pyramids",
      "The Nile River runs through it",
      "It's the largest city in Africa"
    ],
    fun_fact: [
      "This city is nicknamed 'The City of a Thousand Minarets'",
      "It's home to the oldest music industry in the Arab world"
    ],
    trivia: [
      "This city's name means 'The Victorious' in Arabic",
      "It houses the largest museum of Egyptian antiquities"
    ]
  },
  {
    city: "Sydney",
    country: "Australia",
    clues: [
      "This city has a famous opera house with a unique design",
      "It hosted the Summer Olympics in 2000",
      "It's built around one of the world's largest natural harbors"
    ],
    fun_fact: [
      "This city's Harbour Bridge is nicknamed 'The Coathanger'",
      "It has more than 100 beaches in and around the city"
    ],
    trivia: [
      "This city was founded as a British penal colony",
      "It's the oldest and largest city in Australia"
    ]
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    clues: [
      "This city has a giant statue of Christ on a mountain",
      "It's famous for its annual carnival celebration",
      "It hosted the 2016 Summer Olympics"
    ],
    fun_fact: [
      "This city's name means 'January River' in Portuguese",
      "It has the world's largest urban forest"
    ],
    trivia: [
      "This city was once the capital of Portugal",
      "It's home to the famous Copacabana and Ipanema beaches"
    ]
  },
  {
    city: "Rome",
    country: "Italy",
    clues: [
      "This city is known as the 'Eternal City'",
      "It has a famous ancient amphitheater",
      "It contains an independent city-state within its borders"
    ],
    fun_fact: [
      "This city has over 2,000 fountains",
      "People throw about €1.5 million into one of its fountains each year"
    ],
    trivia: [
      "This city was founded in 753 BC according to legend",
      "It's built on seven hills"
    ]
  },
  {
    city: "Cape Town",
    country: "South Africa",
    clues: [
      "This city has a famous flat-topped mountain",
      "It's located near the meeting point of two oceans",
      "It was the first European settlement in South Africa"
    ],
    fun_fact: [
      "This city has the highest commercial bungee jump in the world",
      "It's home to the world's smallest floral kingdom"
    ],
    trivia: [
      "This city has been called the 'Mother City'",
      "It was once a vital stop on the spice route to the East"
    ]
  }
];

async function main() {
  console.log('Starting seed...');

  try {
    // Try to clear existing data, but don't fail if tables don't exist
    try {
      await prisma.countryPlayed.deleteMany({});
      console.log('Cleared CountryPlayed table');
    } catch (e) {
      console.log('CountryPlayed table might not exist yet, continuing...');
    }
    
    try {
      await prisma.clue.deleteMany({});
      console.log('Cleared Clue table');
    } catch (e) {
      console.log('Clue table might not exist yet, continuing...');
    }
    
    try {
      await prisma.funFact.deleteMany({});
      console.log('Cleared FunFact table');
    } catch (e) {
      console.log('FunFact table might not exist yet, continuing...');
    }
    
    try {
      await prisma.trivia.deleteMany({});
      console.log('Cleared Trivia table');
    } catch (e) {
      console.log('Trivia table might not exist yet, continuing...');
    }
    
    try {
      await prisma.city.deleteMany({});
      console.log('Cleared City table');
    } catch (e) {
      console.log('City table might not exist yet, continuing...');
    }
    
    try {
      await prisma.country.deleteMany({});
      console.log('Cleared Country table');
    } catch (e) {
      console.log('Country table might not exist yet, continuing...');
    }

    // Group destinations by country
    const countriesMap = {};
    
    for (const destination of mockDestinations) {
      if (!countriesMap[destination.country]) {
        countriesMap[destination.country] = {
          name: destination.country,
          cities: [],
          clues: [],
          funFacts: [],
          trivias: []
        };
      }
      
      // Add city
      countriesMap[destination.country].cities.push(destination.city);
      
      // Add clues, fun facts, and trivia
      countriesMap[destination.country].clues.push(...destination.clues);
      countriesMap[destination.country].funFacts.push(...destination.fun_fact);
      countriesMap[destination.country].trivias.push(...destination.trivia);
    }
    
    // Create countries and related data
    for (const countryName in countriesMap) {
      const countryData = countriesMap[countryName];
      
      console.log(`Creating country: ${countryName}...`);
      
      // Create the country
      const country = await prisma.country.create({
        data: {
          name: countryName
        }
      });
      
      // Create cities
      for (const cityName of countryData.cities) {
        await prisma.city.create({
          data: {
            name: cityName,
            countryId: country.id
          }
        });
      }
      
      // Create clues
      for (const clueText of countryData.clues) {
        await prisma.clue.create({
          data: {
            text: clueText,
            countryId: country.id
          }
        });
      }
      
      // Create fun facts
      for (const factText of countryData.funFacts) {
        await prisma.funFact.create({
          data: {
            text: factText,
            countryId: country.id
          }
        });
      }
      
      // Create trivia
      for (const triviaText of countryData.trivias) {
        await prisma.trivia.create({
          data: {
            text: triviaText,
            countryId: country.id
          }
        });
      }
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 