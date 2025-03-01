import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { mockDestinations } from '@/data/mockDestinations';

export async function GET() {
  try {
    // Get all countries from the database with clue count
    const countries = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            clues: true // Include count of clues to know how many questions are available
          }
        }
      }
    });

    if (countries.length === 0) {
      // If no countries in database, return mock data
      const mockCountries = [...new Set(mockDestinations.map(dest => dest.country))].map((name, index) => ({
        id: index + 1,
        name,
        _count: {
          clues: mockDestinations.filter(d => d.country === name).flatMap(d => d.clues).length
        }
      }));
      
      return NextResponse.json(mockCountries);
    }
    
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    
    // Fallback to mock data if database fails
    const mockCountries = [...new Set(mockDestinations.map(dest => dest.country))].map((name, index) => ({
      id: index + 1,
      name,
      _count: {
        clues: mockDestinations.filter(d => d.country === name).flatMap(d => d.clues).length
      }
    }));
    
    return NextResponse.json(mockCountries);
  }
} 