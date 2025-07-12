import { getCabinById } from '../src/lib/actions/cabins'

async function testCabinId() {
  try {
    const testId = '686ae668691217d7a6e73168' // First cabin ID from our check
    console.log('Testing getCabinById with ID:', testId)
    
    const cabin = await getCabinById(testId)
    
    if (cabin) {
      console.log('✅ Success! Found cabin:', cabin.name)
      console.log('Cabin data:', {
        id: cabin.id,
        name: cabin.name,
        slug: cabin.slug
      })
    } else {
      console.log('❌ No cabin found with ID:', testId)
    }
  } catch (error) {
    console.error('❌ Error testing cabin ID:', error)
  }
}

testCabinId()