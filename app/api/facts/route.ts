import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const countryId = url.searchParams.get('countryId');
    
    if (!countryId) {
      return NextResponse.json(
        { error: 'Country ID is required' },
        { status: 400 }
      );
    }
    
    // Get fun facts and trivia for the country
    const country = await prisma.country.findUnique({
      where: { id: parseInt(countryId) },
      select: {
        id: true,
        name: true,
        funFacts: {
          select: {
            id: true,
            text: true
          }
        },
        trivias: {
          select: {
            id: true,
            text: true
          }
        }
      }
    });
    
    if (!country) {
      // Fallback to mock data if country not found
      const mockCountry = mockDestinations.find(
        dest => dest.city_id === parseInt(countryId)
      );
      
      if (!mockCountry) {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        );
      }
      
      // Format mock data to match the expected structure
      const funFacts = mockCountry.fun_fact.map((text: string, index: number) => ({
        id: index + 1,
        text
      }));
      
      const trivias = mockCountry.trivia.map((text: string, index: number) => ({
        id: funFacts.length + index + 1,
        text
      }));
      
      // Combine fun facts and trivia
      const allFacts = [
        ...funFacts.map((fact: { id: number, text: string }) => ({ id: fact.id, text: fact.text, type: 'fun_fact' })),
        ...trivias.map((trivia: { id: number, text: string }) => ({ id: trivia.id, text: trivia.text, type: 'trivia' }))
      ];
      
      // Get a random fact if there are any
      let randomFact = null;
      if (allFacts.length > 0) {
        randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
      }
      
      return NextResponse.json({
        countryId: parseInt(countryId),
        countryName: mockCountry.country,
        funFacts,
        trivias,
        randomFact
      });
    }
    
    // Combine fun facts and trivia
    const allFacts = [
      ...country.funFacts.map(fact => ({ id: fact.id, text: fact.text, type: 'fun_fact' })),
      ...country.trivias.map(trivia => ({ id: trivia.id, text: trivia.text, type: 'trivia' }))
    ];
    
    // Get a random fact if there are any
    let randomFact = null;
    if (allFacts.length > 0) {
      randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];
    }
    
    return NextResponse.json({
      countryId: country.id,
      countryName: country.name,
      funFacts: country.funFacts,
      trivias: country.trivias,
      randomFact
    });
  } catch (error) {
    console.error('Error fetching country facts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country facts' },
      { status: 500 }
    );
  }
} 