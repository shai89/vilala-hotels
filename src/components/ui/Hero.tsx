'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNextWeekendDates, getImmediateDates } from '@/lib/utils/date-helpers';

interface HeroStats {
  totalCabins: number;
  uniqueRegions: number;
  uniqueAmenities: number;
}

export function Hero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Default stats (current real values from database as of query date)
  // These values are fetched from the database based on:
  // - totalCabins: Count of active cabins
  // - uniqueRegions: Count of unique regions from active cabins  
  // - uniqueAmenities: Count of unique amenities from active cabins and their rooms
  const [stats, setStats] = useState<HeroStats>({
    totalCabins: 3,        // 3 active cabins found
    uniqueRegions: 3,      // 3 unique regions: גליל עליון, הכרמל, מדבר יהודה
    uniqueAmenities: 12    // 12 unique amenities found across all cabins and rooms
  });

  // Optional: Fetch real-time stats (uncomment to enable dynamic fetching)
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const response = await fetch('/api/hero-stats');
  //       if (response.ok) {
  //         const data = await response.json();
  //         if (data.success) {
  //           setStats(data.data);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching hero stats:', error);
  //     }
  //   };
  //   
  //   fetchStats();
  // }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchData.destination) params.set('region', searchData.destination);
    if (searchData.checkIn) params.set('checkin', searchData.checkIn);
    if (searchData.checkOut) params.set('checkout', searchData.checkOut);
    if (searchData.guests) params.set('guests', searchData.guests.toString());
    
    router.push(`/cabins?${params.toString()}`);
  };

  const handleWeekendBooking = () => {
    const weekendDates = getNextWeekendDates();
    const params = new URLSearchParams();
    
    params.set('checkin', weekendDates.checkIn);
    params.set('checkout', weekendDates.checkOut);
    params.set('guests', '2'); // Default to 2 guests
    
    router.push(`/cabins?${params.toString()}`);
  };

  const handleImmediateBooking = () => {
    const immediateDates = getImmediateDates();
    const params = new URLSearchParams();
    
    params.set('checkin', immediateDates.checkIn);
    params.set('checkout', immediateDates.checkOut);
    params.set('guests', '2'); // Default to 2 guests
    
    router.push(`/cabins?${params.toString()}`);
  };

  const getWeekendPreview = () => {
    const weekendDates = getNextWeekendDates();
    return weekendDates.displayText;
  };

  const getImmediatePreview = () => {
    const immediateDates = getImmediateDates();
    return immediateDates.displayText;
  };

  return (
    <div className="relative min-h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")'
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-8 sm:py-12">
        <div className="text-center text-white max-w-5xl mx-auto mb-8 sm:mb-12">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 leading-tight">
            גלה את המקום
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-pink-300">
            המושלם שלך
          </h2>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 leading-relaxed px-2 sm:px-4">
            חפש מבין מאות מקומות יוקרתיים בכל רחבי הארץ - מהגליל הירוק ועד למדבר
            <br className="hidden sm:block" /><span className="sm:hidden"> </span>יהודה - מצא את החופשה הבאה שלך
          </p>
          
          {/* Smart Booking Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 sm:mb-8 px-2">
            <div className="relative">
              <button 
                onClick={handleWeekendBooking}
                onMouseEnter={() => setHoveredButton('weekend')}
                onMouseLeave={() => setHoveredButton(null)}
                className="bg-white text-purple-700 px-4 sm:px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-w-0"
                title="הזמן צימר לסוף השבוע הקרוב (חמישי-שבת)"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                מקומות לסופש הקרוב
              </button>
              {hoveredButton === 'weekend' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                  {getWeekendPreview()}
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={handleImmediateBooking}
                onMouseEnter={() => setHoveredButton('immediate')}
                onMouseLeave={() => setHoveredButton(null)}
                className="bg-pink-500 text-white px-4 sm:px-6 py-2.5 rounded-full font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base min-w-0"
                title="הזמן צימר זמין מיד - לפני 12:00 מהיום, אחרי 12:00 ממחר"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                זמין מיד
              </button>
              {hoveredButton === 'immediate' && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                  {getImmediatePreview()}
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Stats with Background - Above search form */}
        <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 md:px-8 py-2 sm:py-3 md:py-4 mb-4 sm:mb-6 mx-2">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 text-gray-800">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.totalCabins}</div>
              <div className="text-xs sm:text-xs opacity-70">יעדים מומלצים</div>
            </div>
            <div className="text-center border-l border-r border-gray-300 px-2 sm:px-4 md:px-8">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.uniqueRegions}+</div>
              <div className="text-xs sm:text-xs opacity-70">אזורים</div>
            </div>
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.uniqueAmenities}+</div>
              <div className="text-xs sm:text-xs opacity-70">פינוק</div>
            </div>
          </div>
        </div>
        
        {/* Search Form */}
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
          <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 backdrop-blur-sm bg-white/95">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 items-end">
              <div className="space-y-1">
                <label className="block text-xs sm:text-xs font-medium text-gray-700">יעד</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-900 text-sm"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                >
                  <option value="">בחר יעד</option>
                  <option value="גליל">גליל</option>
                  <option value="גולן">גולן</option>
                  <option value="ירושלים">ירושלים</option>
                  <option value="מרכז">מרכז</option>
                  <option value="דרום">דרום</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs sm:text-xs font-medium text-gray-700">הגעה</label>
                <input
                  type="date"
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-xs sm:text-sm"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs sm:text-xs font-medium text-gray-700">עזיבה</label>
                <input
                  type="date"
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-xs sm:text-sm"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs sm:text-xs font-medium text-gray-700">אורחים</label>
                <select
                  className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-xs sm:text-sm"
                  value={searchData.guests}
                  onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                >
                  <option value={1}>1 אורח</option>
                  <option value={2}>2 אורחים</option>
                  <option value={3}>3 אורחים</option>
                  <option value={4}>4 אורחים</option>
                  <option value={5}>5 אורחים</option>
                  <option value={6}>6+ אורחים</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs sm:text-xs font-medium text-gray-700">מסננים</label>
                <button className="w-full px-2 sm:px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-right text-xs sm:text-sm">
                  כל המסננים
                </button>
              </div>
              
              <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-purple-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  חפש
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}