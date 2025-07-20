import { createCabin } from '../src/lib/actions/cabins'

async function testCreateCabin() {
  console.log('🔍 Testing createCabin action...\n')
  
  const testData = {
    name: 'Test מקום',
    slug: 'test-place',
    description: 'זה מקום לבדיקה',
    type: 'cabin',
    city: 'תל אביב',
    region: 'מרכז',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    maxGuests: 4,
    amenities: ['Wi-Fi', 'מטבח']
  }
  
  try {
    const result = await createCabin(testData)
    
    if (result.success) {
      console.log('✅ createCabin succeeded!')
      console.log('📋 Created cabin details:')
      console.log(`• Name: ${result.cabin.name}`)
      console.log(`• Type: ${result.cabin.type || 'undefined'}`)
      console.log(`• City: ${result.cabin.city}`)
      console.log(`• Region: ${result.cabin.region}`)
      console.log(`• ID: ${result.cabin.id}`)
      console.log('• Full response:', JSON.stringify(result.cabin, null, 2))
      
      // Clean up - delete the test cabin
      const { deleteCabin } = await import('../src/lib/actions/cabins')
      await deleteCabin(result.cabin.id)
      console.log('🧹 Test cabin cleaned up')
    } else {
      console.log('❌ createCabin failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Error in test:', error)
  }
  
  console.log('\n✅ Test complete!')
}

testCreateCabin().catch(console.error)