'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createCabin } from '@/lib/actions/cabins'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ImageEditModal } from '@/components/admin/ImageEditModal'

interface Room {
  id: string;
  name: string;
  pricePerNight: number;
  maxGuests: number;
  size: number;
  amenities: string[];
}

export default function AddCabinPage() {
  const [cabin, setCabin] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'cabin',
    city: '',
    region: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    maxGuests: 4
  });

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'חדר 1',
      pricePerNight: 0,
      maxGuests: 2,
      size: 0,
      amenities: []
    }
  ]);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const amenitiesList = [
    'אינטרנט אלחוטי',
    'בריכה', 
    'חניה',
    'שולחן טניס',
    'מטבח מאובזר',
    'אמבטיה',
    'חיות',
    'ג\'קוזי',
    'מיזוג אוויר',
    'מכונת כביסה',
    'עמדת ברביקיו'
  ];

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addRoom = () => {
    const newRoom: Room = {
      id: (rooms.length + 1).toString(),
      name: `חדר ${rooms.length + 1}`,
      pricePerNight: 0,
      maxGuests: 2,
      size: 0,
      amenities: []
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (roomId: string, field: keyof Room, value: any) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, [field]: value } : room
    ));
  };

  const removeRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    if (!cabin.name || !cabin.slug || !cabin.city || !cabin.region) {
      alert('אנא מלא את כל השדות הנדרשים (שם, slug, עיר, איזור)')
      return
    }

    if (rooms.length === 0) {
      alert('אנא הוסף לפחות חדר אחד')
      return
    }

    // Validate rooms
    for (const room of rooms) {
      if (!room.name || room.pricePerNight === 0 || room.maxGuests === 0) {
        alert('אנא מלא את כל הפרטים הנדרשים בחדרים (שם, מחיר, מספר אורחים)')
        return
      }
    }

    setIsSaving(true)
    try {
      const result = await createCabin({
        ...cabin,
        type: cabin.type,
        amenities: selectedAmenities,
        rooms: rooms
      })
      
      if (result.success) {
        alert('המקום נוצר בהצלחה!')
        router.push('/admin/cabins')
      } else {
        alert('שגיאה ביצירת המקום: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating cabin:', error)
      alert('שגיאה ביצירת המקום')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/cabins')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">הוספת מקום</h1>
              <span className="text-sm text-gray-500">צור מקום חדש במערכת</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSaving}
              >
                ביטול
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || !cabin.name || !cabin.slug || !cabin.city || !cabin.region}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isSaving ? 'יוצר...' : 'שמור מקום'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                פרטי המקום
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שם המקום *</label>
                    <input
                      type="text"
                      value={cabin.name}
                      onChange={(e) => setCabin(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="הכנס את שם המקום..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סוג המקום *</label>
                    <select
                      value={cabin.type}
                      onChange={(e) => setCabin(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="cabin">צימר</option>
                      <option value="villa">וילה</option>
                      <option value="loft">לופט</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <input
                      type="text"
                      value={cabin.slug}
                      onChange={(e) => setCabin(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="cabin-name-slug"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">עיר *</label>
                    <input
                      type="text"
                      value={cabin.city}
                      onChange={(e) => setCabin(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="שם העיר"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">איזור *</label>
                    <select
                      value={cabin.region}
                      onChange={(e) => setCabin(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">בחר איזור</option>
                      <option value="מדבר יהודה">מדבר יהודה</option>
                      <option value="גליל עליון">גליל עליון</option>
                      <option value="הכרמל">הכרמל</option>
                      <option value="דרום">דרום</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תיאור המקום</label>
                  <textarea
                    value={cabin.description}
                    onChange={(e) => setCabin(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    placeholder="תאר את המקום - מה מיוחד בו ואיך הוא נראה..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שעת כניסה</label>
                    <input
                      type="time"
                      value={cabin.checkInTime}
                      onChange={(e) => setCabin(prev => ({ ...prev, checkInTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שעת יציאה</label>
                    <input
                      type="time"
                      value={cabin.checkOutTime}
                      onChange={(e) => setCabin(prev => ({ ...prev, checkOutTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">מקס' אורחים</label>
                    <input
                      type="number"
                      value={cabin.maxGuests}
                      onChange={(e) => setCabin(prev => ({ ...prev, maxGuests: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      min="1"
                      max="20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">חדרים</h2>
                <button 
                  onClick={addRoom}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  הוסף חדר
                </button>
              </div>

              <div className="space-y-4">
                {rooms.map((room) => (
                  <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">חדר {room.id}</h3>
                      {rooms.length > 1 && (
                        <button 
                          onClick={() => removeRoom(room.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם החדר *</label>
                        <input
                          type="text"
                          value={room.name}
                          onChange={(e) => updateRoom(room.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          placeholder="למשל: חדר זוגי עליון"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">מחיר ללילה (₪) *</label>
                        <input
                          type="number"
                          value={room.pricePerNight}
                          onChange={(e) => updateRoom(room.id, 'pricePerNight', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">מקס' אורחים (₪) *</label>
                        <input
                          type="number"
                          value={room.maxGuests}
                          onChange={(e) => updateRoom(room.id, 'maxGuests', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          min="1"
                          max="12"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">גודל (מ"ר) *</label>
                        <input
                          type="number"
                          value={room.size}
                          onChange={(e) => updateRoom(room.id, 'size', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">מתקנים בחדר</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {amenitiesList.map((amenity) => (
                          <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={room.amenities.includes(amenity)}
                              onChange={(e) => {
                                const currentAmenities = room.amenities;
                                const newAmenities = e.target.checked 
                                  ? [...currentAmenities, amenity]
                                  : currentAmenities.filter(a => a !== amenity);
                                updateRoom(room.id, 'amenities', newAmenities);
                              }}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-xs text-gray-700">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Amenities */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">מתקנים כלליים</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
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

            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                תמונות המקום
              </h2>
              
              <ImageUpload
                entityType="cabin"
                entityId="temp" // Will be updated after cabin creation
                images={images}
                onImagesChange={setImages}
                maxImages={10}
                allowBatchUpload={true}
                onEditImage={setSelectedImageIndex}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SEO Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                הגדרות SEO מקודם
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">כותרת SEO</label>
                  <input
                    type="text"
                    placeholder="כותרת עמוד לגוגל - נותן לביטוח"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">תיאור SEO</label>
                  <textarea
                    placeholder="מקום בסגנום במדבר עם נוף מדהים לכרמל הדהים, בריכה פרטית ועיצוב מדהים. מקום מושלם לזוגות המחפשים חוויה רומנטית ובלתי נשכחת במדבר יהודה."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Edit Modal */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <ImageEditModal
          image={images[selectedImageIndex]}
          isOpen={selectedImageIndex !== null}
          onClose={() => setSelectedImageIndex(null)}
          onSave={(updatedImage) => {
            setImages(prev => prev.map((img, index) => 
              index === selectedImageIndex ? updatedImage : img
            ));
            setSelectedImageIndex(null);
          }}
          onDelete={(imageId) => {
            setImages(prev => prev.filter(img => img.id !== imageId));
            setSelectedImageIndex(null);
          }}
        />
      )}
    </div>
  );
}