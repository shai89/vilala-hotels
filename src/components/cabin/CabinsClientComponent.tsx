'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Cabin {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  region: string;
  amenities: {
    name: string;
    category: string;
  }[];
  images: {
    url: string;
    alt: string;
    is_cover: boolean;
  }[];
  featured: boolean;
  rooms: {
    id: string;
    name: string;
    pricePerNight: number;
    maxGuests: number;
  }[];
  _count: {
    reviews: number;
  };
}

interface CabinsClientComponentProps {
  initialCabins: Cabin[];
  initialSearchParams: {
    location?: string;
    guests?: string;
    checkin?: string;
    checkout?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string;
    region?: string;
  };
}

const regions = ['הכל', 'צפון', 'מרכז', 'דרום', 'ירושלים', 'הכרמל', 'גליל', 'גולן'];
const amenityCategories = ['הכל', 'פנים', 'חוץ', 'כללי', 'פינוק'];

export default function CabinsClientComponent({ 
  initialCabins, 
  initialSearchParams 
}: CabinsClientComponentProps) {
  const [cabins, setCabins] = useState<Cabin[]>(initialCabins);
  const [filteredCabins, setFilteredCabins] = useState<Cabin[]>(initialCabins);
  const [loading, setLoading] = useState(false);
  
  // Search filters
  const [searchLocation, setSearchLocation] = useState(initialSearchParams.location || '');
  const [selectedRegion, setSelectedRegion] = useState(initialSearchParams.region || 'הכל');
  const [maxGuests, setMaxGuests] = useState(parseInt(initialSearchParams.guests || '1'));
  const [minPrice, setMinPrice] = useState(parseInt(initialSearchParams.minPrice || '0'));
  const [maxPrice, setMaxPrice] = useState(parseInt(initialSearchParams.maxPrice || '2000'));
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialSearchParams.amenities ? initialSearchParams.amenities.split(',') : []
  );
  
  // View options
  const [sortBy, setSortBy] = useState('featured');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get unique amenities from all cabins
  const allAmenities = Array.from(
    new Set(
      initialCabins.flatMap(cabin => 
        cabin.amenities?.map(amenity => amenity.name) || []
      )
    )
  ).filter(Boolean);

  // Apply filters
  useEffect(() => {
    let filtered = [...cabins];

    // Location filter
    if (searchLocation) {
      filtered = filtered.filter(cabin => 
        cabin.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
        cabin.city?.toLowerCase().includes(searchLocation.toLowerCase()) ||
        cabin.region?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion !== 'הכל') {
      filtered = filtered.filter(cabin => cabin.region === selectedRegion);
    }

    // Guests filter
    filtered = filtered.filter(cabin => 
      cabin.rooms?.some(room => room.maxGuests >= maxGuests)
    );

    // Price filter
    filtered = filtered.filter(cabin => {
      const minRoomPrice = Math.min(...cabin.rooms?.map(room => room.pricePerNight) || [0]);
      return minRoomPrice >= minPrice && minRoomPrice <= maxPrice;
    });

    // Amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(cabin =>
        selectedAmenities.every(amenity =>
          cabin.amenities?.some(cabinAmenity => cabinAmenity.name === amenity)
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.rooms?.map(room => room.pricePerNight) || [0]);
          const priceB = Math.min(...b.rooms?.map(room => room.pricePerNight) || [0]);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = Math.min(...a.rooms?.map(room => room.pricePerNight) || [0]);
          const priceB = Math.min(...b.rooms?.map(room => room.pricePerNight) || [0]);
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'he'));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    setFilteredCabins(filtered);
    setCurrentPage(1);
  }, [cabins, searchLocation, selectedRegion, maxGuests, minPrice, maxPrice, selectedAmenities, sortBy]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchLocation('');
    setSelectedRegion('הכל');
    setMaxGuests(1);
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedAmenities([]);
  };

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCabins = filteredCabins.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCabins.length / itemsPerPage);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            צימרים בישראל
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            מצאו את הצימר המושלם עבורכם מתוך מגוון רחב של אפשרויות בכל רחבי הארץ
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            {showMobileFilters ? 'הסתר פילטרים' : 'הצג פילטרים'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">סינון תוצאות</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  נקה הכל
                </button>
              </div>

              {/* Location Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מיקום
                </label>
                <input
                  type="text"
                  placeholder="חפש עיר או אזור..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אזור
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  מספר אורחים: {maxGuests}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  טווח מחירים (₪ לילה)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    placeholder="מינימום"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                  />
                  <input
                    type="number"
                    placeholder="מקסימום"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value) || 2000)}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  מתקנים
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allAmenities.slice(0, 10).map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <span className="mr-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-900">
                  נמצאו {filteredCabins.length} צימרים
                </h3>
                <p className="text-sm text-gray-600">
                  עמוד {currentPage} מתוך {totalPages}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">מומלצים</option>
                  <option value="price-low">מחיר: נמוך לגבוה</option>
                  <option value="price-high">מחיר: גבוה לנמוך</option>
                  <option value="name">שם א-ת</option>
                </select>

                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                >
                  <option value="6">6 בעמוד</option>
                  <option value="12">12 בעמוד</option>
                  <option value="24">24 בעמוד</option>
                </select>
              </div>
            </div>

            {/* Cabins Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedCabins.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצאו צימרים</h3>
                <p className="text-gray-600 mb-4">נסו לשנות את הפילטרים כדי למצוא תוצאות</p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  נקה פילטרים
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedCabins.map((cabin) => {
                  const coverImage = cabin.images?.find(img => img.is_cover) || cabin.images?.[0];
                  const minPrice = Math.min(...cabin.rooms?.map(room => room.pricePerNight) || [0]);
                  const maxGuests = Math.max(...cabin.rooms?.map(room => room.maxGuests) || [0]);

                  return (
                    <Link 
                      key={cabin.id} 
                      href={`/cabin/${cabin.slug}`}
                      className="block group"
                    >
                      <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={coverImage?.url || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                            alt={cabin.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {cabin.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                מומלץ
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-4 left-4">
                            <div className="flex items-center gap-1 bg-white bg-opacity-90 rounded-full px-2 py-1">
                              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-medium">4.8</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {cabin.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 text-gray-600 mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">{cabin.city}, {cabin.region}</span>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {cabin.description}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 3a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>עד {maxGuests} אורחים</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {formatPrice(minPrice)}
                              </div>
                              <div className="text-sm text-gray-500">לילה</div>
                            </div>
                          </div>

                          <div className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center">
                            צפה בפרטים
                          </div>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  הקודם
                </button>
                
                <div className="flex gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  הבא
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}