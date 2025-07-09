'use server'

import { prisma } from '@/lib/prisma'

export async function getCabins() {
  try {
    const cabins = await prisma.cabin.findMany({
      include: {
        rooms: true,
      },
      orderBy: {
        createdDate: 'desc'
      }
    })

    return cabins.map(cabin => ({
      id: cabin.id,
      name: cabin.name,
      slug: cabin.slug,
      description: cabin.description,
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
      images: typeof cabin.images === 'string' 
        ? JSON.parse(cabin.images) 
        : cabin.images || [],
      rooms: cabin.rooms?.map(room => ({
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

    return {
      id: cabin.id,
      name: cabin.name,
      slug: cabin.slug,
      description: cabin.description,
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
      images: typeof cabin.images === 'string' 
        ? JSON.parse(cabin.images) 
        : cabin.images || [],
      rooms: cabin.rooms?.map(room => ({
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

    return {
      success: true,
      cabin: {
        id: updatedCabin.id,
        name: updatedCabin.name,
        slug: updatedCabin.slug,
        description: updatedCabin.description,
        city: updatedCabin.city,
        region: updatedCabin.region,
        checkInTime: updatedCabin.checkInTime,
        checkOutTime: updatedCabin.checkOutTime,
        maxGuests: updatedCabin.maxGuests,
        amenities: typeof updatedCabin.amenities === 'string' 
          ? JSON.parse(updatedCabin.amenities) 
          : updatedCabin.amenities || [],
        featured: updatedCabin.featured,
        rating: updatedCabin.rating,
        images: typeof updatedCabin.images === 'string' 
          ? JSON.parse(updatedCabin.images) 
          : updatedCabin.images || [],
        rooms: updatedCabin.rooms || [],
        createdAt: updatedCabin.createdDate.toISOString(),
        updatedAt: updatedCabin.updatedDate.toISOString()
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
    const newCabin = await prisma.cabin.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
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

    return {
      success: true,
      cabin: {
        id: newCabin.id,
        name: newCabin.name,
        slug: newCabin.slug,
        description: newCabin.description,
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
        images: newCabin.images || [],
        rooms: newCabin.rooms || [],
        createdAt: newCabin.createdDate.toISOString(),
        updatedAt: newCabin.updatedDate.toISOString()
      }
    }
  } catch (error) {
    console.error('Error creating cabin:', error)
    return { success: false, error: 'Failed to create cabin' }
  }
}