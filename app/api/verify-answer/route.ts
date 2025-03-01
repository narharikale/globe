import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';
import { VerifyAnswerRequest, VerifyAnswerResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const { clueId, selectedCountryId } = await request.json() as VerifyAnswerRequest;
    
    if (!clueId || selectedCountryId === undefined) {
      return NextResponse.json(
        { error: 'Clue ID and selected country ID are required' },
        { status: 400 }
      );
    }
    
    // Get the clue and its associated country
    const clue = await prisma.clue.findUnique({
      where: { id: parseInt(clueId.toString()) },
      include: {
        country: true
      }
    });
    
    if (!clue) {
      // Fallback to mock data if clue not found
      const mockClue = mockDestinations.flatMap(dest => 
        dest.clues.map((clueText: string) => ({
          id: Math.floor(Math.random() * 10000),
          text: clueText,
          countryId: dest.city_id || Math.floor(Math.random() * 10000),
          country: {
            id: dest.city_id || Math.floor(Math.random() * 10000),
            name: dest.country
          }
        }))
      ).find(c => c.id === clueId);
      
      if (!mockClue) {
        return NextResponse.json(
          { error: 'Clue not found' },
          { status: 404 }
        );
      }
      
      const isCorrect = mockClue.countryId === parseInt(selectedCountryId.toString());
      
      // Get a random fact from the mock destination
      const mockDest = mockDestinations.find(dest => dest.country === mockClue.country.name);
      const allFacts = mockDest ? [...mockDest.fun_fact, ...mockDest.trivia] : [];
      const factToShow = allFacts.length > 0 
        ? allFacts[Math.floor(Math.random() * allFacts.length)]
        : `Interesting fact about ${mockClue.country.name}`;
      
      const response: VerifyAnswerResponse = {
        isCorrect,
        correctCountryId: mockClue.countryId,
        correctCountryName: mockClue.country.name,
        factToShow
      };
      
      return NextResponse.json(response);
    }
    
    // Check if the selected country matches the correct country
    const isCorrect = clue.countryId === parseInt(selectedCountryId.toString());
    
    // Get a random fact about the country
    const allFacts = await prisma.$queryRaw`
      SELECT id, text, 'fun_fact' as type FROM "FunFact" WHERE "countryId" = ${clue.countryId}
      UNION ALL
      SELECT id, text, 'trivia' as type FROM "Trivia" WHERE "countryId" = ${clue.countryId}
    `;
    
    let factToShow = `Interesting fact about ${clue.country.name}`;
    if (Array.isArray(allFacts) && allFacts.length > 0) {
      const randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
      factToShow = randomFact.text;
    }
    
    const response: VerifyAnswerResponse = {
      isCorrect,
      correctCountryId: clue.countryId,
      correctCountryName: clue.country.name,
      factToShow
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error verifying answer:', error);
    return NextResponse.json(
      { error: 'Failed to verify answer' },
      { status: 500 }
    );
  }
} 