import { getCabins } from '../src/lib/actions/cabins'

async function testActions() {
  console.log('🔍 Testing cabin actions...\n')
  
  try {
    const cabins = await getCabins()
    console.log(`✅ getCabins() returned ${cabins.length} properties`)
    
    // Test that type field is included
    const sampleCabin = cabins[0]
    if (sampleCabin && sampleCabin.type) {
      console.log(`✅ Type field is present: ${sampleCabin.name} is type "${sampleCabin.type}"`)
    } else {
      console.log('❌ Type field missing in getCabins response')
    }
    
    // Show distribution
    const byType = cabins.reduce((acc, cabin) => {
      acc[cabin.type] = (acc[cabin.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\n📊 Distribution by type:')
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`• ${type}: ${count}`)
    })
    
  } catch (error) {
    console.error('❌ Error testing actions:', error)
  }
  
  console.log('\n✅ Actions test complete!')
}

testActions().catch(console.error)