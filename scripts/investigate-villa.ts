import { prisma } from '../src/lib/prisma'

async function investigateVilla() {
  console.log('🔍 Investigating "הוילה של חומי"...\n')
  
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
  
  console.log('🏠 Villa Details:')
  console.log(`• Name: ${villa.name}`)
  console.log(`• Slug: ${villa.slug || 'NULL'}`)
  console.log(`• Type: ${villa.type}`)
  console.log(`• City: ${villa.city}`)
  console.log(`• Region: ${villa.region}`)
  console.log(`• Max Guests: ${villa.maxGuests}`)
  console.log(`• Rooms Count: ${villa.rooms.length}`)
  
  if (villa.rooms.length > 0) {
    console.log('\n🛏️ Room Details:')
    villa.rooms.forEach((room, index) => {
      console.log(`  Room ${index + 1}:`)
      console.log(`    • Name: ${room.name}`)
      console.log(`    • Price Per Night: ${room.pricePerNight}`)
      console.log(`    • Max Guests: ${room.maxGuests}`)
      console.log(`    • Size: ${room.sizeSqm} sqm`)
    })
  } else {
    console.log('\n❌ No rooms found!')
  }
  
  await prisma.$disconnect()
}

investigateVilla().catch(console.error)