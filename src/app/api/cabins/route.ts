import { NextResponse } from 'next/server';
import { getCabinsFromCSV } from '@/lib/csvData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    let cabins = await getCabinsFromCSV();

    // Filter by region
    if (region && region !== 'all') {
      cabins = cabins.filter(cabin => cabin.region === region);
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      cabins = cabins.filter(cabin => {
        const minRoomPrice = Math.min(...cabin.rooms.map(room => room.pricePerNight));
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

    // Sort by priority (1 first, then 0, then -1)
    cabins.sort((a, b) => b.priority - a.priority);

    return NextResponse.json(cabins);
  } catch (error) {
    console.error('Error fetching cabins:', error);
    return NextResponse.json({ error: 'Failed to fetch cabins' }, { status: 500 });
  }
}