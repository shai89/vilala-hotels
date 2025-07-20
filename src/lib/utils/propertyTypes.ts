// Property type translation utilities

export type PropertyType = 'cabin' | 'villa' | 'loft'

// English to Hebrew translation
export const propertyTypeToHebrew: Record<PropertyType, string> = {
  cabin: 'צימר',
  villa: 'וילה',
  loft: 'לופט'
}

// Hebrew to English translation
export const hebrewToPropertyType: Record<string, PropertyType> = {
  'צימר': 'cabin',
  'וילה': 'villa',
  'לופט': 'loft'
}

// Get Hebrew display name for property type
export function getHebrewPropertyType(type: PropertyType): string {
  return propertyTypeToHebrew[type] || type
}

// Get English property type from Hebrew
export function getEnglishPropertyType(hebrew: string): PropertyType {
  return hebrewToPropertyType[hebrew] || 'cabin'
}

// Get all property types with Hebrew labels
export function getAllPropertyTypes(): Array<{ value: PropertyType; label: string }> {
  return [
    { value: 'cabin', label: 'צימר' },
    { value: 'villa', label: 'וילה' },
    { value: 'loft', label: 'לופט' }
  ]
}

// Get plural form in Hebrew
export const propertyTypePluralHebrew: Record<PropertyType, string> = {
  cabin: 'צימרים',
  villa: 'וילות',
  loft: 'לופטים'
}

export function getHebrewPropertyTypePlural(type: PropertyType): string {
  return propertyTypePluralHebrew[type] || type
}