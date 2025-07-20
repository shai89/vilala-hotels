'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featuredImage: string | null
  published: boolean
  publishedAt: string | null
  tags: string[]
  author: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  } | null
  createdAt: string
  updatedAt: string
}

interface BlogClientProps {
  articles: Article[]
}

export function BlogClient({ articles }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)

  // Get unique tags from all articles
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)))

  // Filter articles based on search and tag
  useEffect(() => {
    let filtered = articles

    // Search by title or excerpt
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(article => article.tags.includes(selectedTag))
    }

    // Sort by published date (newest first)
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedTag])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(' ').length
    return Math.ceil(words / wordsPerMinute)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          בלוג Vilala
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          מאמרים מעניינים על צימרים, טיפים לחופשה, מקומות מומלצים ועוד
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              חיפוש מאמרים
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="חפש לפי כותרת או תוכן..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Tag Filter */}
          <div className="w-full lg:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              נושא
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">כל הנושאים</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            className={`w-full lg:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium ${
              (searchTerm || selectedTag) 
                ? 'visible' 
                : 'invisible pointer-events-none'
            }`}
          >
            נקה מסננים
          </button>
        </div>

        {/* Tag Pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === ''
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              הכל
            </button>
            {allTags.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredArticles.length} מאמרים נמצאו
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <Link key={article.id} href={`/blog/${article.slug}`} className="block group">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Featured Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={article.featuredImage || 'https://images.unsplash.com/photo-1464822759844-d150baec0151?auto=format&fit=crop&w=800&q=60'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {article.tags[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h2>
                
                {article.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    {article.author?.image && (
                      <Image
                        src={article.author.image}
                        alt={article.author.name || 'Author'}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <span>{article.author?.name || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{calculateReadingTime(article.content)} דקות קריאה</span>
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                </div>
                
                {/* Read More Button */}
                <div className="text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors">
                  קרא עוד →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצאו מאמרים</h3>
            <p className="text-gray-600 mb-4">נסה לשנות את הפילטרים או לחפש משהו אחר</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              נקה מסננים
            </button>
          </div>
        </div>
      )}
    </div>
  )
}