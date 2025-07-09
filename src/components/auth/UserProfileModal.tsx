"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  category: string
  birthDate: string
  status: string
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    birthDate: '',
    status: 'פעיל'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()
            if (data.user) {
              setProfile({
                name: data.user.name || '',
                email: data.user.email || '',
                phone: data.user.phone || '',
                location: data.user.location || '',
                category: data.user.category || '',
                birthDate: data.user.birthDate || '',
                status: data.user.status || 'פעיל'
              })
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error)
          // Fallback to session data
          setProfile({
            name: session.user.name || '',
            email: session.user.email || '',
            phone: '',
            location: '',
            category: '',
            birthDate: '',
            status: 'פעיל'
          })
        }
      }
    }

    if (isOpen) {
      loadProfile()
    }
  }, [session, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Update session with new data
        await update({
          name: profile.name,
        })
        setMessage('הפרטים נשמרו בהצלחה!')
        setTimeout(() => {
          onClose()
        }, 1500)
      } else {
        setMessage('שגיאה בשמירת הפרטים: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('שגיאה בשמירת הפרטים')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-bold text-gray-900">שיי אברהם</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center py-6">
          <div className="relative">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {session?.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Email Display */}
        <div className="px-6 pb-4 text-center">
          <p className="text-sm text-gray-600">{session?.user?.email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            מזוהה
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <h3 className="text-right font-medium text-gray-900 mb-4">עריכת פרטים אישיים</h3>
          
          <div className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  placeholder="0508491111"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            {/* Location */}
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">מיקום</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
              />
            </div>

            {/* Category */}
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
              <input
                type="text"
                value={profile.category}
                onChange={(e) => setProfile({...profile, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
              />
            </div>

            {/* Status and Birth Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">הערה לפ״ה</label>
                <input
                  type="text"
                  value={profile.status}
                  onChange={(e) => setProfile({...profile, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">עסקיג זהות</label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
              message.includes('בהצלחה') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}