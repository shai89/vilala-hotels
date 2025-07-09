'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { UserEditModal } from '@/components/admin/UserEditModal'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: Date | null
  role: string
  status: string
  joinDate: string
}

interface UsersClientProps {
  initialUsers: User[]
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const [selectedFilter, setSelectedFilter] = useState('כל המשתמשים')
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Role mapping
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'מנהל מערכת'
      case 'cabin-owner': return 'בעל צימר'
      case 'regular': return 'משתמש רגיל'
      default: return role
    }
  }

  const getRoleFilterValue = (displayRole: string) => {
    switch (displayRole) {
      case 'מנהל מערכת': return 'admin'
      case 'בעל צימר': return 'cabin-owner'
      case 'משתמש רגיל': return 'regular'
      default: return displayRole
    }
  }

  // Calculate stats
  const stats = {
    totalUsers: users.filter(u => u.role === 'regular').length,
    approvedUsers: users.filter(u => u.role === 'admin').length,
    cabinOwners: users.filter(u => u.role === 'cabin-owner').length,
    pendingUsers: users.length
  }

  const handleUpdateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.id !== userId))
      }
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  // Real-time filtering
  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        (user.name && user.name.includes(searchTerm)) || 
        user.email.includes(searchTerm)
      )
    }

    // Filter by role
    if (selectedFilter !== 'כל המשתמשים') {
      const filterRole = getRoleFilterValue(selectedFilter)
      filtered = filtered.filter(user => user.role === filterRole)
    }

    setFilteredUsers(filtered)
  }, [users, selectedFilter, searchTerm])

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <div className="bg-white shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול משתמשים</h1>
          <p className="text-gray-600 mt-1">צפה ונהל את כל המשתמשים במערכת</p>
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
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">4</span>
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            + צור חדש
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">משתמשים רגילים</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">בעלי צימרים</p>
                <p className="text-2xl font-bold text-green-600">{stats.cabinOwners}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m3 0a1 1 0 001-1V10M9 21h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">מנהלי מערכת</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.approvedUsers}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">סה"כ משתמשים</p>
                <p className="text-2xl font-bold text-purple-600">{stats.pendingUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
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
                placeholder="חפש משתמש לפי שם או אימייל..."
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
                <option>כל המשתמשים</option>
                <option>משתמש רגיל</option>
                <option>בעל צימר</option>
                <option>מנהל מערכת</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name || 'ללא שם'}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-gray-500 text-xs">הצטרף ב: {user.joinDate}</p>
                    {user.emailVerified && (
                      <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        מזוהה
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 
                      user.role === 'cabin-owner' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'פעיל' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="עריכת משתמש"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">לא נמצאו משתמשים התואמים את החיפוש</p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  )
}