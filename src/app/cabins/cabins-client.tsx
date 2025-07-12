'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Cabin {
  id: string
  name: string
  slug: string
  description: string | null
  city: string | null
  region: string | null
  checkInTime: string | null
  checkOutTime: string | null
  maxGuests: number
  amenities: string[]
  featured: boolean
  rating: number
  images: {
    url: string
    alt: string
    is_cover: boolean
  }[]
  rooms: {
    id: string
    pricePerNight: number
    maxGuests: number
  }[]
  createdAt: string
  updatedAt: string
}

interface CabinsClientProps {
  initialCabins: Cabin[]
  initialSearchParams: {
    location?: string
    guests?: string
    checkin?: string
    checkout?: string
    minPrice?: string
    maxPrice?: string
    amenities?: string
    region?: string
  }
}

export function CabinsClient({ initialCabins, initialSearchParams }: CabinsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [cabins, setCabins] = useState<Cabin[]>(initialCabins || [])
  const [filteredCabins, setFilteredCabins] = useState<Cabin[]>(initialCabins || [])
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.location ? decodeURIComponent(initialSearchParams.location) : '')
  const [selectedRegion, setSelectedRegion] = useState(initialSearchParams.region ? decodeURIComponent(initialSearchParams.region) : '')
  const [guestCount, setGuestCount] = useState(parseInt(initialSearchParams.guests || '1'))
  const [priceRange, setPriceRange] = useState({
    min: parseInt(initialSearchParams.minPrice || '0'),
    max: parseInt(initialSearchParams.maxPrice || '2000')
  })
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialSearchParams.amenities ? 
      initialSearchParams.amenities.split(',').map(amenity => decodeURIComponent(amenity)) : 
      []
  )
  const [sortBy, setSortBy] = useState('name')

  // Get unique regions and amenities
  const regions = Array.from(new Set(cabins.map(cabin => cabin.region).filter((region): region is string => Boolean(region))))
  const allAmenities = Array.from(new Set(cabins.flatMap(cabin => cabin.amenities || [])))

  // Filter cabins based on search criteria
  useEffect(() => {
    let filtered = cabins

    // Search by name or city
    if (searchTerm) {
      filtered = filtered.filter(cabin => 
        cabin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cabin.city && cabin.city.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(cabin => cabin.region === selectedRegion)
    }

    // Filter by guest count
    if (guestCount > 1) {
      filtered = filtered.filter(cabin => cabin.maxGuests >= guestCount)
    }

    // Filter by price range
    filtered = filtered.filter(cabin => {
      const minPrice = cabin.rooms && cabin.rooms.length > 0 
        ? Math.min(...cabin.rooms.map(room => room.pricePerNight))
        : 0
      return minPrice >= priceRange.min && minPrice <= priceRange.max
    })

    // Filter by amenities
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(cabin => 
        cabin.amenities && selectedAmenities.every(amenity => cabin.amenities.includes(amenity))
      )
    }

    // Sort cabins
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          const priceA = a.rooms && a.rooms.length > 0 ? Math.min(...a.rooms.map(r => r.pricePerNight)) : 0
          const priceB = b.rooms && b.rooms.length > 0 ? Math.min(...b.rooms.map(r => r.pricePerNight)) : 0
          return priceA - priceB
        case 'price-high':
          const priceA2 = a.rooms.length > 0 ? Math.min(...a.rooms.map(r => r.pricePerNight)) : 0
          const priceB2 = b.rooms.length > 0 ? Math.min(...b.rooms.map(r => r.pricePerNight)) : 0
          return priceB2 - priceA2
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredCabins(filtered)
  }, [cabins, searchTerm, selectedRegion, guestCount, priceRange, selectedAmenities, sortBy])

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRegion('')
    setGuestCount(1)
    setPriceRange({ min: 0, max: 2000 })
    setSelectedAmenities([])
    setSortBy('name')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">כל הצימרים</h1>
        <p className="text-lg text-gray-600">
          מצא את הצימר המושלם עבורך מתוך {cabins.length} צימרים מדהימים
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">מסננים</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                נקה הכל
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                חפש צימר או עיר
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="שם צימר או עיר..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Region Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                איזור
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">כל האזורים</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות אורחים
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} אורחים</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                טווח מחירים (₪ ללילה)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  placeholder="מינימום"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 2000 }))}
                  placeholder="מקסימום"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                מתקנים
              </label>
              <div className="max-h-48 overflow-y-auto">
                {allAmenities.slice(0, 10).map(amenity => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              {filteredCabins.length} צימרים נמצאו
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">מיין לפי:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
              >
                <option value="name">שם</option>
                <option value="price-low">מחיר: נמוך לגבוה</option>
                <option value="price-high">מחיר: גבוה לנמוך</option>
                <option value="rating">דירוג</option>
              </select>
            </div>
          </div>

          {/* Cabins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCabins.map(cabin => {
              const coverImage = cabin.images && cabin.images.length > 0 
                ? (cabin.images.find(img => img.is_cover) || cabin.images[0])
                : null
              const minPrice = cabin.rooms && cabin.rooms.length > 0 
                ? Math.min(...cabin.rooms.map(room => room.pricePerNight))
                : 0

              return (
                <Link key={cabin.id} href={`/cabin/${cabin.slug}`} className="block group">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={coverImage?.url || '/placeholder-cabin.jpg'}
                        alt={cabin.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Featured Badge */}
                      {cabin.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            מומלץ
                          </span>
                        </div>
                      )}

                      {/* Rating */}
                      {cabin.rating > 0 && (
                        <div className="absolute top-3 left-3">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-900">
                              {cabin.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {cabin.name}
                      </h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{cabin.city}, {cabin.region}</span>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>עד {cabin.maxGuests} אורחים</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-gray-900">
                            ₪{minPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">ללילה</span>
                        </div>
                        <div className="text-purple-600 font-medium text-sm">
                          צפה בפרטים →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* No Results */}
          {filteredCabins.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצאו צימרים</h3>
                <p className="text-gray-600 mb-4">נסה לשנות את הפילטרים או לחפש משהו אחר</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  נקה מסננים
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}