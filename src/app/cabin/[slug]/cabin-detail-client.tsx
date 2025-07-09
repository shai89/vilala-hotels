'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

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
  images: {
    url: string
    alt: string
    is_cover: boolean
  }[]
  rooms: {
    id: string
    name: string
    pricePerNight: number
    maxGuests: number
    size: number
    amenities: string[]
  }[]
  createdAt: string
  updatedAt: string
}

interface CabinDetailClientProps {
  cabin: Cabin
}

export function CabinDetailClient({ cabin }: CabinDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(0)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guests, setGuests] = useState(2)
  const [showFullGallery, setShowFullGallery] = useState(false)

  const coverImage = cabin.images.find(img => img.is_cover) || cabin.images[0]
  const minPrice = cabin.rooms.length > 0 
    ? Math.min(...cabin.rooms.map(room => room.pricePerNight))
    : 0

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const roomPrice = cabin.rooms[selectedRoom]?.pricePerNight || minPrice
    const subtotal = roomPrice * nights
    const serviceFee = subtotal * 0.1 // 10% service fee
    return subtotal + serviceFee
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image Gallery */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <Image
          src={cabin.images[selectedImageIndex]?.url || '/placeholder-cabin.jpg'}
          alt={cabin.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={() => setShowFullGallery(true)}
            className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-opacity-100 transition-all"
          >
            צפה בכל התמונות ({cabin.images.length})
          </button>
        </div>
        
        {/* Thumbnail Gallery */}
        {cabin.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-2 max-w-xs overflow-x-auto">
            {cabin.images.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index 
                    ? 'border-white scale-110' 
                    : 'border-white/50 hover:border-white'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${cabin.name} תמונה ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {cabin.images.length > 5 && (
              <div className="flex items-center justify-center w-16 h-16 bg-black/50 rounded-lg text-white text-sm font-medium">
                +{cabin.images.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cabin Title and Info */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                <div>
                  {cabin.featured && (
                    <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                      מומלץ
                    </span>
                  )}
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                    {cabin.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  {cabin.rating > 0 && (
                    <>
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{cabin.rating.toFixed(1)}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{cabin.city}, {cabin.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>עד {cabin.maxGuests} אורחים</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">אודות הצימר</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {cabin.description}
              </p>
            </div>

            {/* Rooms */}
            {cabin.rooms.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">חדרים זמינים</h2>
                <div className="space-y-4">
                  {cabin.rooms.map((room, index) => (
                    <div 
                      key={room.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRoom === index ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRoom(index)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{room.name}</h3>
                          <p className="text-sm text-gray-600">עד {room.maxGuests} אורחים • {room.size} מ"ר</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-600">
                            {formatPrice(room.pricePerNight)}
                          </div>
                          <div className="text-sm text-gray-500">ללילה</div>
                        </div>
                      </div>
                      
                      {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {room.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">+{room.amenities.length - 3} עוד</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">מתקנים ושירותים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cabin.amenities.slice(0, 10).map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in/out Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">כללי הצימר</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">כניסה: {cabin.checkInTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">יציאה: {cabin.checkOutTime}</span>
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">תמונות</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cabin.images.slice(0, 8).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 lg:sticky lg:top-4">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(cabin.rooms[selectedRoom]?.pricePerNight || minPrice)}
                  </span>
                  <span className="text-gray-600">/ לילה</span>
                </div>
                {cabin.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{cabin.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תאריך כניסה
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תאריך יציאה
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מספר אורחים
                  </label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[...Array(cabin.maxGuests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'אורח' : 'אורחים'}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  בדוק זמינות
                </button>
              </div>

              {/* Price Breakdown */}
              {checkInDate && checkOutDate && calculateNights() > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {formatPrice(cabin.rooms[selectedRoom]?.pricePerNight || minPrice)} × {calculateNights()} לילות
                      </span>
                      <span>
                        {formatPrice((cabin.rooms[selectedRoom]?.pricePerNight || minPrice) * calculateNights())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">עמלת שירות (10%)</span>
                      <span>
                        {formatPrice((cabin.rooms[selectedRoom]?.pricePerNight || minPrice) * calculateNights() * 0.1)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                      <span>סך הכל</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  צור קשר ישיר עם בעלי הצימר
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  שלח הודעה בווצאפ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Search Button */}
        <div className="mt-12 text-center">
          <Link
            href="/cabins"
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזור לכל הצימרים
          </Link>
        </div>
      </div>

      {/* Mobile Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(cabin.rooms[selectedRoom]?.pricePerNight || minPrice)}
            </div>
            <div className="text-sm text-gray-600">לילה</div>
          </div>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            בדוק זמינות
          </button>
        </div>
      </div>
    </div>
  )
}