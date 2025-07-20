'use server'

import { prisma } from '@/lib/prisma'

export async function getCabins() {
  try {
    console.log('Fetching cabins from database...');
    const cabins = await prisma.cabin.findMany({
      include: {
        rooms: true,
      },
      orderBy: {
        createdDate: 'desc'
      }
    })
    console.log('Found cabins:', cabins.length);

    // Get all images for these cabins
    const cabinIds = cabins.map(cabin => cabin.id);
    const roomIds = cabins.flatMap(cabin => cabin.rooms?.map(room => room.id) || []);
    
    const [cabinImages, roomImages] = await Promise.all([
      prisma.image.findMany({
        where: {
          entityType: 'cabin',
          entityId: { in: cabinIds }
        },
        orderBy: [
          { isCover: 'desc' },
          { sortOrder: 'asc' }
        ]
      }),
      prisma.image.findMany({
        where: {
          entityType: 'room',
          entityId: { in: roomIds }
        },
        orderBy: [
          { isCover: 'desc' },
          { sortOrder: 'asc' }
        ]
      })
    ]);

    return cabins.map(cabin => ({
      id: cabin.id,
      name: cabin.name,
      slug: cabin.slug,
      description: cabin.description,
      type: cabin.type,
      city: cabin.city,
      region: cabin.region,
      checkInTime: cabin.checkInTime,
      checkOutTime: cabin.checkOutTime,
      maxGuests: cabin.maxGuests,
      amenities: typeof cabin.amenities === 'string' 
        ? JSON.parse(cabin.amenities) 
        : cabin.amenities || [],
      featured: cabin.featured,
      rating: cabin.rating,
      images: cabinImages
        .filter(img => img.entityId === cabin.id)
        .map(img => ({
          id: img.id,
          url: img.secureUrl,
          alt: img.altText || cabin.name,
          is_cover: img.isCover,
          title: img.title,
          description: img.description,
          width: img.width,
          height: img.height,
          publicId: img.publicId
        })),
      rooms: cabin.rooms?.map(room => ({
        ...room,
        pricePerNight: Number(room.pricePerNight),
        weekendPrice: room.weekendPrice ? Number(room.weekendPrice) : null,
        holidayPrice: room.holidayPrice ? Number(room.holidayPrice) : null,
        amenities: typeof room.amenities === 'string' 
          ? JSON.parse(room.amenities) 
          : room.amenities || [],
        images: roomImages
          .filter(img => img.entityId === room.id)
          .map(img => ({
            id: img.id,
            url: img.secureUrl,
            alt: img.altText || room.name,
            is_cover: img.isCover,
            title: img.title,
            description: img.description,
            width: img.width,
            height: img.height,
            publicId: img.publicId
          })),
      })) || [],
      createdAt: cabin.createdDate.toISOString(),
      updatedAt: cabin.updatedDate.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching cabins:', error)
    return []
  }
}

export async function getCabinById(id: string) {
  try {
    const cabin = await prisma.cabin.findUnique({
      where: { id },
      include: {
        rooms: true,
      }
    })

    if (!cabin) return null

    // Get images for this cabin and its rooms
    const roomIds = cabin.rooms?.map(room => room.id) || [];
    
    const [cabinImages, roomImages] = await Promise.all([
      prisma.image.findMany({
        where: {
          entityType: 'cabin',
          entityId: cabin.id
        },
        orderBy: [
          { isCover: 'desc' },
          { sortOrder: 'asc' }
        ]
      }),
      roomIds.length > 0 ? prisma.image.findMany({
        where: {
          entityType: 'room',
          entityId: { in: roomIds }
        },
        orderBy: [
          { isCover: 'desc' },
          { sortOrder: 'asc' }
        ]
      }) : []
    ]);

    return {
      id: cabin.id,
      name: cabin.name,
      slug: cabin.slug,
      description: cabin.description,
      type: cabin.type,
      city: cabin.city,
      region: cabin.region,
      checkInTime: cabin.checkInTime,
      checkOutTime: cabin.checkOutTime,
      maxGuests: cabin.maxGuests,
      amenities: typeof cabin.amenities === 'string' 
        ? JSON.parse(cabin.amenities) 
        : cabin.amenities || [],
      featured: cabin.featured,
      rating: cabin.rating,
      images: cabinImages.map(img => ({
        id: img.id,
        url: img.secureUrl,
        alt: img.altText || cabin.name,
        is_cover: img.isCover,
        title: img.title,
        description: img.description,
        width: img.width,
        height: img.height,
        publicId: img.publicId
      })),
      rooms: cabin.rooms?.map(room => ({
        ...room,
        pricePerNight: Number(room.pricePerNight),
        weekendPrice: room.weekendPrice ? Number(room.weekendPrice) : null,
        holidayPrice: room.holidayPrice ? Number(room.holidayPrice) : null,
        amenities: typeof room.amenities === 'string' 
          ? JSON.parse(room.amenities) 
          : room.amenities || [],
        images: roomImages
          .filter(img => img.entityId === room.id)
          .map(img => ({
            id: img.id,
            url: img.secureUrl,
            alt: img.altText || room.name,
            is_cover: img.isCover,
            title: img.title,
            description: img.description,
            width: img.width,
            height: img.height,
            publicId: img.publicId
          })),
      })) || [],
      createdAt: cabin.createdDate.toISOString(),
      updatedAt: cabin.updatedDate.toISOString()
    }
  } catch (error) {
    console.error('Error fetching cabin:', error)
    return null
  }
}

export async function updateCabin(id: string, data: any) {
  try {
    const updatedCabin = await prisma.cabin.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type,
        city: data.city,
        region: data.region,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        maxGuests: data.maxGuests,
        amenities: JSON.stringify(data.amenities || []),
        featured: data.featured || false,
        rating: data.rating || 0
      },
      include: {
        rooms: true,
      }
    })

    // Handle rooms updates if provided
    if (data.rooms) {
      // Delete existing rooms
      await prisma.room.deleteMany({
        where: { cabinId: id }
      })

      // Create new rooms
      for (const roomData of data.rooms) {
        await prisma.room.create({
          data: {
            name: roomData.name,
            cabinId: id,
            description: roomData.description || '',
            maxGuests: roomData.maxGuests,
            pricePerNight: roomData.pricePerNight,
            weekendPrice: roomData.weekendPrice || null,
            sizeSqm: roomData.sizeSqm || null,
            amenities: JSON.stringify(roomData.amenities || []),
            images: JSON.stringify([]),
            createdById: 'system',
            createdBy: 'system'
          }
        })
      }
    }

    // Get updated cabin with rooms
    const finalCabin = await prisma.cabin.findUnique({
      where: { id },
      include: { rooms: true }
    })

    return {
      success: true,
      cabin: {
        id: finalCabin!.id,
        name: finalCabin!.name,
        slug: finalCabin!.slug,
        description: finalCabin!.description,
        type: finalCabin!.type,
        city: finalCabin!.city,
        region: finalCabin!.region,
        checkInTime: finalCabin!.checkInTime,
        checkOutTime: finalCabin!.checkOutTime,
        maxGuests: finalCabin!.maxGuests,
        amenities: typeof finalCabin!.amenities === 'string' 
          ? JSON.parse(finalCabin!.amenities) 
          : finalCabin!.amenities || [],
        featured: finalCabin!.featured,
        rating: finalCabin!.rating,
        images: typeof finalCabin!.images === 'string' 
          ? JSON.parse(finalCabin!.images) 
          : finalCabin!.images || [],
        rooms: finalCabin!.rooms?.map(room => ({
          ...room,
          pricePerNight: Number(room.pricePerNight),
          weekendPrice: room.weekendPrice ? Number(room.weekendPrice) : null,
          holidayPrice: room.holidayPrice ? Number(room.holidayPrice) : null,
          amenities: typeof room.amenities === 'string' 
            ? JSON.parse(room.amenities) 
            : room.amenities || [],
          images: typeof room.images === 'string' 
            ? JSON.parse(room.images) 
            : room.images || [],
        })) || [],
        createdAt: finalCabin!.createdDate.toISOString(),
        updatedAt: finalCabin!.updatedDate.toISOString()
      }
    }
  } catch (error) {
    console.error('Error updating cabin:', error)
    return { success: false, error: 'Failed to update cabin' }
  }
}

export async function deleteCabin(id: string) {
  try {
    await prisma.cabin.delete({
      where: { id }
    })
    return { success: true }
  } catch (error) {
    console.error('Error deleting cabin:', error)
    return { success: false, error: 'Failed to delete cabin' }
  }
}

export async function createCabin(data: any) {
  try {
    // Get the first available owner
    const firstOwner = await prisma.owner.findFirst()
    if (!firstOwner) {
      return { success: false, error: 'No owners found in database' }
    }

    const newCabin = await prisma.cabin.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        type: data.type || 'cabin',
        city: data.city,
        region: data.region,
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        maxGuests: data.maxGuests,
        amenities: JSON.stringify(data.amenities || []),
        images: JSON.stringify([]),
        featured: data.featured || false,
        rating: data.rating || 0,
        ownerId: firstOwner.id,
        createdById: 'system',
        createdBy: 'system'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        type: true,
        city: true,
        region: true,
        checkInTime: true,
        checkOutTime: true,
        maxGuests: true,
        amenities: true,
        featured: true,
        rating: true,
        images: true,
        createdDate: true,
        updatedDate: true,
      }
    })

    // Create rooms if provided
    const createdRooms = []
    if (data.rooms && data.rooms.length > 0) {
      for (const roomData of data.rooms) {
        const room = await prisma.room.create({
          data: {
            name: roomData.name,
            cabinId: newCabin.id,
            description: roomData.description || '',
            maxGuests: roomData.maxGuests,
            pricePerNight: roomData.pricePerNight,
            weekendPrice: roomData.weekendPrice || null,
            sizeSqm: roomData.size || null,
            amenities: JSON.stringify(roomData.amenities || []),
            images: JSON.stringify([]),
            createdById: 'system',
            createdBy: 'system'
          }
        })
        createdRooms.push({
          id: room.id,
          name: room.name,
          pricePerNight: Number(room.pricePerNight),
          maxGuests: room.maxGuests
        })
      }
    }

    return {
      success: true,
      cabin: {
        id: newCabin.id,
        name: newCabin.name,
        slug: newCabin.slug,
        description: newCabin.description,
        type: newCabin.type,
        city: newCabin.city,
        region: newCabin.region,
        checkInTime: newCabin.checkInTime,
        checkOutTime: newCabin.checkOutTime,
        maxGuests: newCabin.maxGuests,
        amenities: typeof newCabin.amenities === 'string' 
          ? JSON.parse(newCabin.amenities) 
          : newCabin.amenities || [],
        featured: newCabin.featured,
        rating: newCabin.rating,
        images: typeof newCabin.images === 'string' 
          ? JSON.parse(newCabin.images) 
          : newCabin.images || [],
        rooms: createdRooms,
        createdAt: newCabin.createdDate.toISOString(),
        updatedAt: newCabin.updatedDate.toISOString()
      }
    }
  } catch (error) {
    console.error('Error creating cabin:', error)
    return { success: false, error: 'Failed to create cabin' }
  }
}