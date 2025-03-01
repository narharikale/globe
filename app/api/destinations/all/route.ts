import { NextResponse } from 'next/server';
import { getAllCountries } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET() {
  try {
    try {
      // Try to get all destinations from the database
      const destinations = await getAllCountries();
      console.log(destinations, "destinations");
      return NextResponse.json(destinations);
    } catch (dbError) {
      console.error('Database error, falling back to mock data:', dbError);
      
      // Fallback to mock data if database fails
      return NextResponse.json(mockDestinations);
    }
  } catch (error) {
    console.error('Error fetching all destinations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
} 