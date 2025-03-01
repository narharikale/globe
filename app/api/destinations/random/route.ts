import { NextResponse } from 'next/server';
import { getRandomCountries } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET(request: Request) {
  try {
    // Get the count from the URL query parameter, default to 4
    const url = new URL(request.url);
    const count = parseInt(url.searchParams.get('count') || '4', 10);
    
    try {
      // Try to get destinations from the database
      const destinations = await getRandomCountries(count);
      return NextResponse.json(destinations);
    } catch (dbError) {
      console.error('Database error, falling back', dbError);
      
      // Fallback to mock data
      const shuffled = [...mockDestinations].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      return NextResponse.json(selected);
    }
  } catch (error) {
    console.error('Error fetching random destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch random destinations' },
      { status: 500 }
    );
  }
} 