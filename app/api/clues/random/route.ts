import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Clue, Country } from '@prisma/client';

type ClueWithCountry = Clue & {
  country: Country;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludedCountries = searchParams.get('excludedCountries')?.split(',').map(Number) || [];

    const randomClue = await db.clue.findFirst({
      where: {
        countryId: {
          notIn: excludedCountries
        }
      },
      include: {
        country: true
      },
      orderBy: {
        id: 'asc'
      },
      take: 1,
      skip: Math.floor(Math.random() * await db.clue.count())
    }) as ClueWithCountry | null;

    if (!randomClue) {
      return NextResponse.json({ error: 'No clues found' }, { status: 404 });
    }

    return NextResponse.json(randomClue);
  } catch (error) {
    console.error('Error fetching random clue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 