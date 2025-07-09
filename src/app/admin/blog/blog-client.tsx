'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { deleteArticle, toggleArticlePublished } from '@/lib/actions/blog'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string | null
  published: boolean
  publishedAt: string | null
  tags: string[]
  author: {
    id: string
    name: string | null
    email: string
    image: string | null
  } | null
  createdAt: string
  updatedAt: string
}

interface BlogClientProps {
  initialArticles: Article[]
}

export function BlogClient({ initialArticles }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('כל המאמרים')
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(initialArticles)

  // Calculate stats
  const stats = {
    totalArticles: articles.length,
    publishedArticles: articles.filter(a => a.published).length,
    draftArticles: articles.filter(a => !a.published).length,
    todayArticles: articles.filter(a => {
      const today = new Date().toISOString().split('T')[0]
      const articleDate = new Date(a.createdAt).toISOString().split('T')[0]
      return articleDate === today
    }).length
  }

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק מאמר זה?')) {
      return
    }

    try {
      const result = await deleteArticle(articleId)
      if (result.success) {
        setArticles(prev => prev.filter(a => a.id !== articleId))
      } else {
        alert('שגיאה במחיקת המאמר')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('שגיאה במחיקת המאמר')
    }
  }

  const handleTogglePublished = async (articleId: string) => {
    try {
      const result = await toggleArticlePublished(articleId)
      if (result.success && result.article) {
        setArticles(prev => prev.map(a => 
          a.id === articleId ? { ...a, published: result.article!.published, publishedAt: result.article!.publishedAt } : a
        ))
      } else {
        alert('שגיאה בשינוי סטטוס הפרסום')
      }
    } catch (error) {
      console.error('Error toggling published status:', error)
      alert('שגיאה בשינוי סטטוס הפרסום')
    }
  }

  // Real-time filtering
  useEffect(() => {
    let filtered = articles

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.includes(searchTerm) || 
        article.content.includes(searchTerm) ||
        article.tags.some(tag => tag.includes(searchTerm))
      )
    }

    // Filter by status
    if (selectedFilter === 'פורסם') {
      filtered = filtered.filter(article => article.published)
    } else if (selectedFilter === 'טיוטה') {
      filtered = filtered.filter(article => !article.published)
    }

    setFilteredArticles(filtered)
  }, [articles, selectedFilter, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <div className="bg-white shadow-sm p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ניהול בלוג</h1>
          <p className="text-gray-600 mt-1">צפה ונהל את כל המאמרים במערכת בבלוג</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <Link
            href="/admin/blog/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            + מאמר חדש
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">סה"כ מאמרים</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalArticles}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">מאמרים פורסמו</p>
                <p className="text-2xl font-bold text-green-600">{stats.publishedArticles}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">טיוטות</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draftArticles}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">היום</p>
                <p className="text-2xl font-bold text-purple-600">{stats.todayArticles}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                placeholder="חפש מאמר לפי כותרת, תוכן או תגיות..."
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
                <option>כל המאמרים</option>
                <option>פורסם</option>
                <option>טיוטה</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Featured Image */}
                  <div className="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        width={96}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2">{article.title}</h3>
                        {article.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{article.author?.name || article.author?.email || 'ללא מחבר'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                          {article.publishedAt && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>פורסם ב-{formatDate(article.publishedAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {article.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-gray-500">+{article.tags.length - 3} עוד</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status and Actions */}
                      <div className="flex items-center gap-3 ml-4">
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            article.published 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {article.published ? 'פורסם' : 'טיוטה'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublished(article.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              article.published 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={article.published ? 'הסר מפרסום' : 'פרסם מאמר'}
                          >
                            {article.published ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          
                          <Link
                            href={`/admin/blog/${article.id}/edit`}
                            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="עריכת מאמר"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          
                          <button 
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="מחיקת מאמר"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">אין מאמרים</h3>
              <p className="mt-1 text-sm text-gray-500">לא נמצאו מאמרים התואמים את החיפוש</p>
              <div className="mt-6">
                <Link
                  href="/admin/blog/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  מאמר חדש
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}