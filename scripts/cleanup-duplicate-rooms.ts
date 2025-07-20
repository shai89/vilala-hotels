import { prisma } from '../src/lib/prisma'

async function cleanupDuplicateRooms() {
  console.log('🔍 Cleaning up duplicate rooms for "הוילה של חומי"...\n')
  
  // Find the villa
  const villa = await prisma.cabin.findFirst({
    where: {
      name: {
        contains: 'הוילה של חומי'
      }
    },
    include: {
      rooms: true
    }
  })
  
  if (!villa) {
    console.log('❌ Villa not found')
    return
  }
  
  console.log(`✅ Found villa: ${villa.name}`)
  console.log(`📊 Villa currently has ${villa.rooms.length} rooms`)
  
  // Keep only the first 2 rooms (the originals)
  const roomsToKeep = villa.rooms.slice(0, 2)
  const roomsToDelete = villa.rooms.slice(2)
  
  console.log(`🗑️  Deleting ${roomsToDelete.length} duplicate rooms...`)
  
  for (const room of roomsToDelete) {
    await prisma.room.delete({
      where: { id: room.id }
    })
    console.log(`✅ Deleted duplicate room: ${room.name}`)
  }
  
  // Verify cleanup
  const updatedVilla = await prisma.cabin.findFirst({
    where: { id: villa.id },
    include: { rooms: true }
  })
  
  console.log(`\n📊 Villa now has ${updatedVilla?.rooms.length} rooms:`)
  updatedVilla?.rooms.forEach((room, index) => {
    console.log(`  ${index + 1}. ${room.name} - ₪${room.pricePerNight}/night`)
  })
  
  await prisma.$disconnect()
}

cleanupDuplicateRooms().catch(console.error)