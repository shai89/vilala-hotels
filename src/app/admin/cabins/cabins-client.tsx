'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { deleteCabin } from '@/lib/actions/cabins'

interface Cabin {
  id: string
  name: string
  slug: string
  description: string
  city: string
  region: string
  checkInTime: string
  checkOutTime: string
  maxGuests: number
  amenities: string[]
  featured: boolean
  rating: number
  images: any[]
  rooms: any[]
  createdAt: string
  updatedAt: string
}

interface CabinsClientProps {
  initialCabins?: Cabin[]
}

export function CabinsClient({ initialCabins }: CabinsClientProps) {
  const [selectedFilter, setSelectedFilter] = useState('כל הצימרים')
  const [searchTerm, setSearchTerm] = useState('')
  const [cabins, setCabins] = useState<Cabin[]>(initialCabins || [])
  const [filteredCabins, setFilteredCabins] = useState<Cabin[]>(initialCabins || [])

  // Calculate stats
  const stats = {
    totalCabins: cabins.length,
    featuredCabins: cabins.filter(c => c.featured).length,
    activeCabins: cabins.filter(c => c.rooms && c.rooms.length > 0).length,
    regions: new Set(cabins.map(c => c.region).filter(Boolean)).size
  }

  const handleDeleteCabin = async (cabinId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק צימר זה?')) {
      return
    }

    try {
      const result = await deleteCabin(cabinId)
      if (result.success) {
        setCabins(prev => prev.filter(c => c.id !== cabinId))
      } else {
        alert('שגיאה במחיקת הצימר')
      }
    } catch (error) {
      console.error('Error deleting cabin:', error)
      alert('שגיאה במחיקת הצימר')
    }
  }

  // Real-time filtering
  useEffect(() => {
    let filtered = cabins

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cabin => 
        cabin.name.includes(searchTerm) || 
        cabin.city.includes(searchTerm) ||
        cabin.region.includes(searchTerm)
      )
    }

    // Filter by region
    if (selectedFilter !== 'כל הצימרים') {
      filtered = filtered.filter(cabin => cabin.region === selectedFilter)
    }

    setFilteredCabins(filtered)
  }, [cabins, selectedFilter, searchTerm])

  const regions = Array.from(new Set(cabins.map(c => c.region)))

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <div className="bg-white shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול צימרים</h1>
          <p className="text-gray-600 mt-1">צפה ונהל את כל הצימרים במערכת</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <Link 
            href="/admin/cabins/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            + צימר חדש
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">סה"כ צימרים</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalCabins}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">צימרים מומלצים</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.featuredCabins}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">צימרים פעילים</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCabins}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">אזורים</p>
                <p className="text-2xl font-bold text-purple-600">{stats.regions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="חפש צימר לפי שם, עיר או איזור..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <select 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option>כל הצימרים</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cabins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCabins.map((cabin, index) => {
            console.log(`Cabin ${index}: ID = ${cabin.id}, Name = ${cabin.name}`)
            return (
            <div key={cabin.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Cabin Image */}
              <div className="relative h-48 bg-gray-200">
                {cabin.images.length > 0 ? (
                  <Image
                    src={cabin.images[0].url}
                    alt={cabin.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {cabin.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      מומלץ
                    </span>
                  </div>
                )}
              </div>

              {/* Cabin Details */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{cabin.name}</h3>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{cabin.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{cabin.city}, {cabin.region}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>עד {cabin.maxGuests} אורחים</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {cabin.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/cabins/${cabin.id}/edit`}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title={`עריכת צימר - ID: ${cabin.id}`}
                      onClick={() => {
                        console.log('Edit cabin with ID:', cabin.id)
                        console.log('Edit cabin object:', cabin)
                        console.log('Generated URL:', `/admin/cabins/${cabin.id}/edit`)
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button 
                      onClick={() => handleDeleteCabin(cabin.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="מחיקת צימר"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    {cabin.rooms.length} חדרים
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>

        {filteredCabins.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">אין צימרים</h3>
              <p className="mt-1 text-sm text-gray-500">לא נמצאו צימרים התואמים את החיפוש</p>
              <div className="mt-6">
                <Link
                  href="/admin/cabins/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  צימר חדש
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}