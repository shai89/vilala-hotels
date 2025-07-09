"use client"

import { useState } from 'react'
import Image from 'next/image'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: Date | null
  role?: string
  status?: string
}

interface UserEditModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onUpdate: (userId: string, updates: Partial<User>) => void
  onDelete: (userId: string) => void
}

export function UserEditModal({ user, isOpen, onClose, onUpdate, onDelete }: UserEditModalProps) {
  const [editedUser, setEditedUser] = useState({
    name: user.name || '',
    email: user.email,
    role: user.role || 'regular',
    status: user.status || 'פעיל'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onUpdate(user.id, editedUser)
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete(user.id)
      onClose()
    } catch (error) {
      console.error('Error deleting user:', error)
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
          <h2 className="text-lg font-bold text-gray-900">עריכת משתמש</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Avatar */}
        <div className="flex justify-center py-6">
          <div className="relative">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || 'User'}
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {showDeleteConfirm ? (
          <div className="px-6 pb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h3 className="text-red-800 font-medium mb-2">האם אתה בטוח?</h3>
              <p className="text-red-700 text-sm mb-4">
                פעולה זו תמחק את המשתמש לצמיתות ולא ניתן לבטלה.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'מוחק...' : 'מחק'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 pb-6">
            <div className="space-y-4">
              {/* Name */}
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                  required
                />
              </div>

              {/* Email */}
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                <input
                  type="email"
                  value={editedUser.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-right"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">לא ניתן לשנות כתובת אימייל</p>
              </div>

              {/* Role */}
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">תפקיד</label>
                <select
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({...editedUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                >
                  <option value="regular">משתמש רגיל</option>
                  <option value="cabin-owner">בעל צימר</option>
                  <option value="admin">מנהל מערכת</option>
                </select>
              </div>

              {/* Status */}
              <div className="text-right">
                <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
                <select
                  value={editedUser.status}
                  onChange={(e) => setEditedUser({...editedUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                >
                  <option value="פעיל">פעיל</option>
                  <option value="לא פעיל">לא פעיל</option>
                  <option value="חסום">חסום</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? 'שומר...' : 'שמור שינויים'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                מחק
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}