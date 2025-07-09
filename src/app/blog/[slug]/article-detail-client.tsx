'use client'

import { useState } from 'react'
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

interface ArticleDetailClientProps {
  article: Article
}

export function ArticleDetailClient({ article }: ArticleDetailClientProps) {
  const [showFullContent, setShowFullContent] = useState(false)

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

  // Function to safely render HTML content
  const renderContent = (content: string) => {
    // Basic HTML sanitization - in production, use a proper sanitization library
    const sanitizedContent = content
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
    
    return { __html: sanitizedContent }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image */}
      <div className="relative w-full h-80 md:h-96 overflow-hidden">
        <Image
          src={article.featuredImage || 'https://images.unsplash.com/photo-1464822759844-d150baec0151?auto=format&fit=crop&w=1200&q=80'}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        {/* Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mb-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.tags[0]}
                  </span>
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
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
                  <span>מאת {article.author?.name || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{calculateReadingTime(article.content)} דקות קריאה</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          {article.excerpt && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-purple-600">
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            <div 
              className="prose-content [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h1]:mt-8
                         [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h2]:mt-6
                         [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mb-3 [&>h3]:mt-5
                         [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-gray-700
                         [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:text-gray-700
                         [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:text-gray-700
                         [&>li]:mb-2 [&>li]:leading-relaxed
                         [&>blockquote]:border-l-4 [&>blockquote]:border-purple-600 [&>blockquote]:bg-gray-50 [&>blockquote]:p-4 [&>blockquote]:my-6 [&>blockquote]:italic [&>blockquote]:text-gray-700
                         [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-6
                         [&>a]:text-purple-600 [&>a]:hover:text-purple-700 [&>a]:underline"
              dangerouslySetInnerHTML={renderContent(article.content)}
            />
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">תגיות</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          {article.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">אודות הכותב</h3>
              <div className="flex items-start gap-4">
                {article.author.image && (
                  <Image
                    src={article.author.image}
                    alt={article.author.name || 'Author'}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {article.author.name || 'Admin'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    כותב תוכן בצוות Vilala
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                חזור לבלוג
              </Link>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">שתף את המאמר:</span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.excerpt || article.title,
                        url: window.location.href
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                      alert('הקישור הועתק ללוח')
                    }
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                >
                  שתף
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}