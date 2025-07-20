import { NextResponse } from 'next/server';
import { getCabins } from '@/lib/actions/cabins';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    let cabins = await getCabins();

    // Filter by region
    if (region && region !== 'all') {
      cabins = cabins.filter(cabin => cabin.region === region);
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      cabins = cabins.filter(cabin => {
        if (cabin.rooms.length === 0) return false;
        const minRoomPrice = Math.min(...cabin.rooms.map(room => Number(room.pricePerNight)));
        if (minPrice && minRoomPrice < parseInt(minPrice)) return false;
        if (maxPrice && minRoomPrice > parseInt(maxPrice)) return false;
        return true;
      });
    }

    // Filter by search term
    if (search) {
      cabins = cabins.filter(cabin => 
        cabin.name.includes(search) ||
        cabin.description?.includes(search) ||
        cabin.city?.includes(search) ||
        cabin.region?.includes(search)
      );
    }

    // Sort by featured status and rating
    cabins.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });

    console.log('API returning cabins:', cabins.length);
    return NextResponse.json(cabins);
  } catch (error) {
    console.error('Error fetching cabins:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ error: 'Failed to fetch cabins', details: error.message }, { status: 500 });
  }
}