import { prisma } from './prisma';

export interface HeroStats {
  totalCabins: number;
  uniqueRegions: number;
  uniqueAmenities: number;
}

export async function getHeroStats(): Promise<HeroStats> {
  try {
    // 1. Get total number of active cabins
    const totalCabins = await prisma.cabin.count({
      where: {
        status: 'active'
      }
    });

    // 2. Get unique regions
    const uniqueRegions = await prisma.cabin.findMany({
      where: {
        status: 'active',
        region: {
          not: null
        }
      },
      select: {
        region: true
      },
      distinct: ['region']
    });

    // 3. Get all amenities from cabins and rooms
    const cabinsWithAmenities = await prisma.cabin.findMany({
      where: {
        status: 'active'
      },
      select: {
        amenities: true,
        rooms: {
          select: {
            amenities: true
          }
        }
      }
    });

    // Parse amenities JSON strings and collect unique amenities
    const allAmenities = new Set<string>();
    
    cabinsWithAmenities.forEach(cabin => {
      // Parse cabin amenities
      if (cabin.amenities) {
        try {
          const cabinAmenities = JSON.parse(cabin.amenities);
          if (Array.isArray(cabinAmenities)) {
            cabinAmenities.forEach(amenity => allAmenities.add(amenity));
          }
        } catch (error) {
          console.warn('Error parsing cabin amenities:', error);
        }
      }
      
      // Parse room amenities
      cabin.rooms.forEach(room => {
        if (room.amenities) {
          try {
            const roomAmenities = JSON.parse(room.amenities);
            if (Array.isArray(roomAmenities)) {
              roomAmenities.forEach(amenity => allAmenities.add(amenity));
            }
          } catch (error) {
            console.warn('Error parsing room amenities:', error);
          }
        }
      });
    });

    return {
      totalCabins,
      uniqueRegions: uniqueRegions.length,
      uniqueAmenities: allAmenities.size
    };
  } catch (error) {
    console.error('Error getting hero stats:', error);
    // Return fallback values in case of error
    return {
      totalCabins: 0,
      uniqueRegions: 0,
      uniqueAmenities: 0
    };
  }
}