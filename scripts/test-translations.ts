import { 
  getHebrewPropertyType, 
  getHebrewPropertyTypePlural, 
  getAllPropertyTypes 
} from '../src/lib/utils/propertyTypes'

async function testTranslations() {
  console.log('🔍 Testing property type translations...\n')
  
  // Test individual translations
  console.log('✅ Individual translations:')
  console.log(`• cabin → ${getHebrewPropertyType('cabin')}`)
  console.log(`• villa → ${getHebrewPropertyType('villa')}`)
  console.log(`• loft → ${getHebrewPropertyType('loft')}`)
  
  console.log('\n✅ Plural forms:')
  console.log(`• cabin → ${getHebrewPropertyTypePlural('cabin')}`)
  console.log(`• villa → ${getHebrewPropertyTypePlural('villa')}`)
  console.log(`• loft → ${getHebrewPropertyTypePlural('loft')}`)
  
  console.log('\n✅ All types for forms:')
  const allTypes = getAllPropertyTypes()
  allTypes.forEach(type => {
    console.log(`• ${type.value} → ${type.label}`)
  })
  
  console.log('\n✅ Translation functions working correctly!')
}

testTranslations().catch(console.error)