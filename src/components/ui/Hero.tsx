'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  return (
    <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-12">
        <div className="text-center text-white max-w-3xl mx-auto mb-12">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
            גלה את הצימר
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-pink-300">
            המושלם שלך
          </h2>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
            חפש מבין מאות צימרים יוקרתיים בכל רחבי הארץ - מהגליל הירוק ועד למדבר
            <br />יהודה - מצא את החופשה הבאה שלך
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              חיפוש מהיר
            </button>
            <button className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-pink-600 transition-colors">
              דקות ספורות
            </button>
          </div>
          
        </div>
        
        {/* Stats with Background - Above search form */}
        <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full px-4 md:px-8 py-3 md:py-4 mb-6">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-gray-800">
            <div className="text-center">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.totalCabins}</div>
              <div className="text-xs opacity-70">יעדים מומלצים</div>
            </div>
            <div className="text-center border-l border-r border-gray-300 px-4 md:px-8">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.uniqueRegions}+</div>
              <div className="text-xs opacity-70">אזורים</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{stats.uniqueAmenities}+</div>
              <div className="text-xs opacity-70">פינוק</div>
            </div>
          </div>
        </div>
        
        {/* Search Form */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-4 backdrop-blur-sm bg-white/95">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">יעד</label>
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
                <label className="block text-xs font-medium text-gray-700">הגעה</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">עזיבה</label>
                <input
                  type="date"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">אורחים</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-sm"
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
                <label className="block text-xs font-medium text-gray-700">מסננים</label>
                <button className="w-full px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-right text-sm">
                  כל המסננים
                </button>
              </div>
              
              <div className="sm:col-span-2 lg:col-span-1">
                <button 
                  onClick={handleSearch}
                  className="w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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