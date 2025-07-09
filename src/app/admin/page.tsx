'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const mockCabins = [
  {
    id: '1',
    name: 'צימר יוקרה - מדבר יהודה',
    location: 'מצפה רמון, מדבר יהודה',
    status: 'פעיל',
    rating: 0,
    reviewsCount: 0,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'יוקרה',
    priority: 0
  },
  {
    id: '2',
    name: 'צימר יער הכרמל',
    location: 'ירכא יעקב, הכרמל',
    status: 'פעיל',
    rating: 0,
    reviewsCount: 0,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'פעיל',
    priority: 1
  },
  {
    id: '3',
    name: 'וילה רומנטית עם נוף לכנרת',
    location: 'כפר ורדים, גליל עליון',
    status: 'פעיל',
    rating: 0,
    reviewsCount: 0,
    image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'גליל',
    priority: 0
  },
  {
    id: '4',
    name: 'צימר רומנטי בכותרת',
    location: 'כותרת רבונית',
    status: 'לא פעיל',
    rating: 0,
    reviewsCount: 0,
    image: 'https://images.unsplash.com/photo-1616628188540-925618239969?auto=format&fit=crop&w=800&q=60',
    category: 'מוצעל',
    priority: -1
  }
];

const stats = {
  pending: 2,
  waitingApproval: 0,
  active: 4,
  totalCabins: 4
};

export default function AdminDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('כל הצימרים');
  const [selectedStatus, setSelectedStatus] = useState('כל הסטטוסים');
  const [searchTerm, setSearchTerm] = useState('');
  const [cabins, setCabins] = useState(mockCabins);
  const [filteredCabins, setFilteredCabins] = useState(mockCabins);

  // Real-time filtering using useEffect
  useEffect(() => {
    let filtered = cabins;

    // Filter by category
    if (selectedFilter !== 'כל הצימרים') {
      filtered = filtered.filter(cabin => cabin.category === selectedFilter);
    }

    // Filter by status
    if (selectedStatus !== 'כל הסטטוסים') {
      filtered = filtered.filter(cabin => cabin.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(cabin => 
        cabin.name.includes(searchTerm) || 
        cabin.location.includes(searchTerm)
      );
    }

    // Sort by priority (1 first, then 0, then -1)
    filtered = filtered.sort((a, b) => b.priority - a.priority);

    setFilteredCabins(filtered);
  }, [cabins, selectedFilter, selectedStatus, searchTerm]);

  const updateCabinPriority = (cabinId: string, priority: number) => {
    setCabins(prev => prev.map(cabin => 
      cabin.id === cabinId ? { ...cabin, priority } : cabin
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Purple Sidebar */}
      <div className="w-80 bg-gradient-to-b from-purple-600 to-purple-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold">Vilala</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-purple-700 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              ניהול צימרים
            </a>
            <a href="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              ניהול משתמשים
            </a>
            <a href="/admin/blog" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              בלוג
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              אנליטיקס
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              הגדרות
            </a>
            <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              הגדרות מערכת
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-purple-500">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-700">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">ש</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">sheabrin@gmail.com</div>
            </div>
            <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
            <button className="text-gray-500 hover:text-gray-700 relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-9a1 1 0 112 0v9z" />
              </svg>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">2</span>
            </button>
            <a href="/admin/cabins/new" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              + צימר חדש
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">מקודמים</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">ממתינים לאישור</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.waitingApproval}</p>
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
                  <p className="text-gray-600 text-sm">פעילים</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">סה"כ צימרים</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalCabins}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="חפש צימר, עיר או אזור..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="lg:w-48">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option>כל הצימרים</option>
                  <option>יוקרה</option>
                  <option>פעיל</option>
                  <option>גליל</option>
                </select>
              </div>
              <div className="lg:w-48">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option>כל הסטטוסים</option>
                  <option>פעיל</option>
                  <option>לא פעיל</option>
                  <option>ממתין לאישור</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cabins List */}
          <div className="space-y-4">
            {filteredCabins.map((cabin) => (
              <div key={cabin.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 flex items-center gap-6">
                  {/* Cabin Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={cabin.image}
                      alt={cabin.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Cabin Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cabin.category === 'יוקרה' ? 'bg-purple-100 text-purple-800' :
                            cabin.category === 'פעיל' ? 'bg-blue-100 text-blue-800' :
                            cabin.category === 'גליל' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {cabin.category}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cabin.status === 'פעיל' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {cabin.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{cabin.name}</h3>
                        <p className="text-gray-600 text-sm">{cabin.location}</p>
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-gray-500 mb-1">0 חדרים</div>
                        <div className="text-sm text-gray-500">{cabin.reviewsCount} ביקורות</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <a href={`/admin/cabins/${cabin.id}`} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </a>
                    <a href={`/admin/cabins/${cabin.id}/edit`} className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </a>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => updateCabinPriority(cabin.id, -1)}
                        className={`p-1 hover:text-gray-600 ${cabin.priority === -1 ? 'text-red-500' : 'text-gray-400'}`}
                        title="הנמך בעדיפות"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => updateCabinPriority(cabin.id, 0)}
                        className={`p-1 hover:text-gray-600 ${cabin.priority === 0 ? 'text-blue-500' : 'text-gray-400'}`}
                        title="ברירת מחדל"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => updateCabinPriority(cabin.id, 1)}
                        className={`p-1 hover:text-gray-600 ${cabin.priority === 1 ? 'text-green-500' : 'text-gray-400'}`}
                        title="העלה בעדיפות"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}