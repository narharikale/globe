# Globetrotter - Interactive Geography Game

Globetrotter is an interactive geography game that challenges players to identify countries based on clues. Test your geography knowledge, learn interesting facts about destinations around the world, and share your scores with friends!

## Features

- **Interactive Geography Quiz**: Identify countries based on various clues
- **Score Tracking**: Keep track of your correct and incorrect answers
- **Shareable Results**: Share your scores on social media with custom links
- **Dynamic SEO**: Optimized social sharing with dynamic metadata
- **Responsive Design**: Play on any device with a fully responsive interface

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router for server and client components
- **TypeScript**: Static type checking for improved code quality and developer experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **NextSEO**: Dynamic SEO management for social sharing

### Backend
- **Prisma ORM**: Type-safe database client for database operations
- **PostgreSQL**: Relational database for storing game data, countries, clues, and user scores
- **Next.js API Routes**: Serverless API endpoints for game logic

### Development Tools
- **ESLint**: Code linting for identifying and fixing code issues
- **TypeScript**: Static type checking for improved code quality

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globe.git
cd globe
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/globe"
```

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## How to Play

1. Start the game by entering your username
2. You'll be presented with a clue about a country
3. Select the correct country from the options provided
4. After completing the game, view your score and share it with friends
5. Challenge your friends to beat your score!

## Database Schema

The application uses the following main data models:
- **Country**: Information about countries
- **City**: Cities associated with countries
- **Clue**: Hints about countries used in the game
- **FunFact**: Interesting facts about countries
- **Trivia**: Additional information about countries

## Deployment

The easiest way to deploy your Globe app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

For database hosting, consider using:

- [Neon](https://neon.tech/)

## Contributing



## License

This project is licensed under the MIT License - see the LICENSE file for details.
