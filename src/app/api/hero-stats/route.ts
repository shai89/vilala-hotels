import { NextResponse } from 'next/server';
import { getHeroStats } from '@/lib/hero-stats';

export async function GET() {
  try {
    const stats = await getHeroStats();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching hero stats:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hero stats',
      data: {
        totalCabins: 0,
        uniqueRegions: 0,
        uniqueAmenities: 0
      }
    }, {
      status: 500
    });
  }
}