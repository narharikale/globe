import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const countryId = url.searchParams.get('countryId');
    const excludeIds = url.searchParams.get('exclude')?.split(',').map(id => parseInt(id)) || [];
    
    // Query parameters
    const whereClause: any = {
      id: {
        notIn: excludeIds
      }
    };
    
    // If countryId is provided, get clues only for that country
    if (countryId) {
      whereClause.countryId = parseInt(countryId);
    }
    
    // Get a random clue
    const cluesCount = await prisma.clue.count({
      where: whereClause
    });
    
    if (cluesCount === 0) {
      // If no clues in database, return mock data
      const allClues = mockDestinations.flatMap(dest => 
        dest.clues.map((clue: string) => ({
          id: Math.floor(Math.random() * 10000),
          text: clue,
          countryId: dest.city_id || Math.floor(Math.random() * 10000)
        }))
      );
      
      // Filter by country if specified
      let filteredClues = allClues;
      if (countryId) {
        const countryIdNum = parseInt(countryId);
        filteredClues = allClues.filter(clue => clue.countryId === countryIdNum);
      }
      
      // Filter out excluded IDs
      filteredClues = filteredClues.filter(clue => !excludeIds.includes(clue.countryId));
      
      if (filteredClues.length === 0) {
        return NextResponse.json(
          { error: 'No clues available for the specified criteria' },
          { status: 404 }
        );
      }
      
      // Get a random clue
      const randomIndex = Math.floor(Math.random() * filteredClues.length);
      const randomClue = filteredClues[randomIndex];
      
      return NextResponse.json(randomClue);
    }
    
    // Get a random clue
    const randomSkip = Math.floor(Math.random() * cluesCount);
    const clue = await prisma.clue.findFirst({
      where: whereClause,
      skip: randomSkip,
      select: {
        id: true,
        text: true,
        countryId: true
      }
    });
    
    return NextResponse.json(clue);
  } catch (error) {
    console.error('Error fetching random clue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random clue' },
      { status: 500 }
    );
  }
} 