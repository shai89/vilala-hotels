'use client'

import { useState, useEffect } from 'react'
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
    name: string
    pricePerNight: number
    maxGuests: number
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
  const [showImageSEO, setShowImageSEO] = useState(false)

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

  // Keyboard navigation for gallery
  useEffect(() => {
    if (!showFullGallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFullGallery(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : cabin.images.length - 1);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex(selectedImageIndex < cabin.images.length - 1 ? selectedImageIndex + 1 : 0);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullGallery, selectedImageIndex, cabin.images.length]);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: cabin.name,
    description: cabin.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: cabin.city,
      addressRegion: cabin.region,
      addressCountry: "IL"
    },
    image: cabin.images.map(img => ({
      "@type": "ImageObject",
      url: img.url,
      caption: img.alt,
      description: img.alt
    })),
    starRating: {
      "@type": "Rating",
      ratingValue: cabin.rating
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />
      {/* Header Image Gallery */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <Image
          src={cabin.images[selectedImageIndex]?.url || '/placeholder-cabin.jpg'}
          alt={cabin.images[selectedImageIndex]?.alt || cabin.name}
          title={cabin.images[selectedImageIndex]?.alt || cabin.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={() => setShowFullGallery(true)}
            className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-opacity-100 transition-all"
          >
            צפה בכל התמונות ({cabin.images.length})
          </button>
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={() => setShowImageSEO(!showImageSEO)}
              className="bg-blue-600 bg-opacity-90 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-100 transition-all"
            >
              SEO Data
            </button>
          )}
        </div>
        
        {/* Thumbnail Gallery */}
        {cabin.images.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-3 max-w-sm">
            {cabin.images.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                  selectedImageIndex === index 
                    ? 'border-white scale-105' 
                    : 'border-white/60 hover:border-white hover:scale-105'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${cabin.name} תמונה ${index + 1}`}
                  title={image.alt || `${cabin.name} תמונה ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {cabin.images.length > 4 && (
              <button
                onClick={() => setShowFullGallery(true)}
                className="flex items-center justify-center w-20 h-20 bg-black/60 hover:bg-black/80 rounded-lg text-white text-sm font-bold transition-all border-2 border-white/60 hover:border-white"
              >
                +{cabin.images.length - 4}
              </button>
            )}
          </div>
        )}
      </div>

      {/* SEO Debug Info */}
      {showImageSEO && process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-100 border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 SEO Data for Current Image</h3>
            {cabin.images[selectedImageIndex] && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <strong className="text-sm text-gray-600">Alt Text:</strong>
                    <p className="text-sm mt-1">{cabin.images[selectedImageIndex].alt || 'Not set'}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-600">Title:</strong>
                    <p className="text-sm mt-1">{cabin.images[selectedImageIndex].alt || 'Not set'}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-gray-600">Description:</strong>
                    <p className="text-sm mt-1">{cabin.images[selectedImageIndex].alt || 'Not set'}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    ✅ This data is being used in: img alt attribute, img title attribute, OpenGraph tags, and JSON-LD structured data
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
                          <p className="text-sm text-gray-600">עד {room.maxGuests} אורחים</p>
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

      {/* Full Gallery Modal */}
      {showFullGallery && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={() => setShowFullGallery(false)}
        >
          <div 
            className="relative w-full h-full max-w-6xl mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowFullGallery(false)}
              className="absolute top-4 right-4 z-[100] bg-black bg-opacity-60 hover:bg-opacity-90 hover:scale-110 text-white p-3 rounded-full transition-all shadow-lg cursor-pointer"
              aria-label="סגור גלרייה"
              title="סגור גלרייה (ESC)"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-60 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {cabin.images.length}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={cabin.images[selectedImageIndex]?.url || '/placeholder-cabin.jpg'}
                alt={cabin.images[selectedImageIndex]?.alt || cabin.name}
                title={cabin.images[selectedImageIndex]?.alt || cabin.name}
                fill
                className="object-contain"
                priority
              />
              
              {/* Navigation Arrows */}
              {cabin.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : cabin.images.length - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(selectedImageIndex < cabin.images.length - 1 ? selectedImageIndex + 1 : 0)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
              <div className="flex gap-3 justify-center items-center overflow-x-auto scrollbar-hide py-2">
                {cabin.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === index 
                        ? 'border-white scale-110 shadow-xl ring-2 ring-white/30' 
                        : 'border-white/50 hover:border-white hover:scale-105'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${cabin.name} תמונה ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Image Info */}
            {cabin.images[selectedImageIndex]?.alt && (
              <div className="absolute bottom-20 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <h3 className="font-semibold">{cabin.images[selectedImageIndex].alt}</h3>
                {cabin.images[selectedImageIndex]?.alt && (
                  <p className="text-sm mt-1 opacity-90">{cabin.images[selectedImageIndex].alt}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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