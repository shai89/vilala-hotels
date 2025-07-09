'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const mockCabin = {
  id: '1',
  name: 'וילה רומנטית עם נוף לכנרת',
  location: 'כפר ורדים, גליל עליון',
  rating: 5.0,
  reviewsCount: 8,
  images: [
    {
      url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'וילה עם בריכה',
      is_cover: true
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'בריכה פרטית',
      is_cover: false
    },
    {
      url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'חדר שינה',
      is_cover: false
    }
  ],
  description: 'צימר יוקרתי עם נוף מרהיב לכנרת, בריכה פרטית ועיצוב מדהים. מקום מושלם לזוגות המחפשים חוויה רומנטית ובלתי נשכחת בגליל העליון.',
  amenities: [
    'בריכה פרטית',
    'ג\'קוזי',
    'Wi-Fi',
    'חניה',
    'מטבח מלא',
    'מרפסת'
  ],
  pricePerNight: 1499,
  minStay: 2,
  checkIn: '16:00',
  checkOut: '11:00'
};

export default function CabinDetailPage() {
  const params = useParams();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              {/* Main Image */}
              <div className="relative aspect-[16/10] mb-4 rounded-lg overflow-hidden">
                <Image
                  src={mockCabin.images[selectedImageIndex].url}
                  alt={mockCabin.images[selectedImageIndex].alt}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2">
                {mockCabin.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-purple-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cabin Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    מומלץ
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {mockCabin.name}
                  </h1>
                  <p className="text-gray-600 mb-4">{mockCabin.location}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">★</span>
                      <span className="font-semibold mr-1">{mockCabin.rating}</span>
                    </div>
                    <span className="text-gray-500">({mockCabin.reviewsCount} ביקורות)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">תיאור הצימר</h2>
                <p className="text-gray-700 leading-relaxed">
                  {mockCabin.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">מתקנים ושירותים</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockCabin.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-green-500">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">כללי הצימר</h2>
                <div className="space-y-2 text-gray-700">
                  <p>• שעת כניסה: {mockCabin.checkIn}</p>
                  <p>• שעת יציאה: {mockCabin.checkOut}</p>
                  <p>• שהייה מינימלית: {mockCabin.minStay} לילות</p>
                  <p>• אין עישון במקום</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ₪{mockCabin.pricePerNight.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">לילה</div>
                </div>

                {/* Booking Form */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        תאריך הגעה
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        תאריך עזיבה
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      מספר אורחים
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                    >
                      <option value={1}>1 אורח</option>
                      <option value={2}>2 אורחים</option>
                      <option value={3}>3 אורחים</option>
                      <option value={4}>4 אורחים</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium mb-4">
                  בדוק זמינות
                </button>

                <div className="text-center text-sm text-gray-500">
                  לא יחויבו תשלום בשלב זה
                </div>

                {/* Contact Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">עדיין אין ביקורות</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    היה הראשון לבקר את הצימר שלנו וכתוב ביקורת
                  </p>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    שלח הודעה לבעלים →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section - Placeholder */}
        <div className="mt-12 bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">נכסים נוספים באזור גליל עליון</h2>
          <p className="text-gray-600">מפה ונכסים נוספים יופיעו כאן</p>
        </div>
      </div>
    </div>
  );
}