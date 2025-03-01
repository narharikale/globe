import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const countryId = url.searchParams.get('countryId');
    const count = parseInt(url.searchParams.get('count') || '4');
    
    if (!countryId) {
      return NextResponse.json(
        { error: 'Country ID is required' },
        { status: 400 }
      );
    }
    
    // Get the correct country
    const correctCountry = await prisma.country.findUnique({
      where: { id: parseInt(countryId) },
      select: {
        id: true,
        name: true
      }
    });
    
    if (!correctCountry) {
      // Fallback to mock data if country not found
      const mockCountries = [...new Set(mockDestinations.map(dest => dest.country))];
      const correctCountryName = mockDestinations.find(
        dest => dest.city_id === parseInt(countryId)
      )?.country;
      
      if (!correctCountryName) {
        return NextResponse.json(
          { error: 'Country not found' },
          { status: 404 }
        );
      }
      
      // Get other random countries for options
      const otherCountries = mockCountries
        .filter(name => name !== correctCountryName)
        .sort(() => Math.random() - 0.5)
        .slice(0, count - 1)
        .map((name, index) => ({
          id: parseInt(countryId) + index + 1, // Generate unique IDs
          name
        }));
      
      // Combine and shuffle options
      const options = [
        { id: parseInt(countryId), name: correctCountryName },
        ...otherCountries
      ].sort(() => Math.random() - 0.5);
      
      return NextResponse.json(options);
    }
    
    // Get other random countries for options
    const otherCountries = await prisma.country.findMany({
      where: {
        id: {
          not: parseInt(countryId)
        }
      },
      select: {
        id: true,
        name: true
      },
      take: count - 1
    });
    
    // Combine and shuffle options
    const options = [correctCountry, ...otherCountries].sort(() => Math.random() - 0.5);
    
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching country options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch country options' },
      { status: 500 }
    );
  }
} 