import { prisma } from '../src/lib/prisma'

async function verifyImplementation() {
  console.log('🔍 Verifying multi-property type implementation...\n')
  
  // Check cabins by type
  const cabins = await prisma.cabin.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      city: true,
      region: true
    }
  })
  
  console.log('📊 Property Types Summary:')
  const typeCounts = cabins.reduce((acc, cabin) => {
    acc[cabin.type] = (acc[cabin.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  console.log(`• Cabins (צימרים): ${typeCounts.cabin || 0}`)
  console.log(`• Villas (וילות): ${typeCounts.villa || 0}`)
  console.log(`• Lofts (לופטים): ${typeCounts.loft || 0}`)
  console.log(`• Total: ${cabins.length}\n`)
  
  // Show sample of each type
  console.log('🏠 Sample Properties:')
  for (const type of ['cabin', 'villa', 'loft']) {
    const sample = cabins.find(c => c.type === type)
    if (sample) {
      console.log(`• ${type.toUpperCase()}: ${sample.name} (${sample.city}, ${sample.region})`)
    }
  }
  
  await prisma.$disconnect()
  console.log('\n✅ Verification complete!')
}

verifyImplementation().catch(console.error)