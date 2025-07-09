'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  authorName: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedDate: string;
}

interface BlogClientComponentProps {
  initialPosts: BlogPost[];
}

const categories = ['הכל', 'משפחות', 'זוגות', 'צפון', 'דרום', 'ניהול', 'טיפים', 'מדריכים', 'יעדים'];

export default function BlogClientComponent({ initialPosts }: BlogClientComponentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  useEffect(() => {
    let filtered = initialPosts;

    if (selectedCategory !== 'הכל') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.includes(searchTerm) || 
        post.excerpt?.includes(searchTerm) ||
        post.tags.some(tag => tag.includes(searchTerm))
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, initialPosts]);

  const handleSearch = () => {
    // Filtering happens automatically via useEffect
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            בלוג Vilala
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מרכז המידע להמלצות בוצימרים בישראל - טיפים, המלצות ועדכונים למשפחות
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="חיפוש מאמרים..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-48">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full lg:w-auto px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              חפש
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <a key={post.id} href={`/blog/${post.slug}`} className="block">
              <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative aspect-[4/3]">
                <Image
                  src={post.featuredImage || 'https://images.unsplash.com/photo-1464822759844-d150baec0151?auto=format&fit=crop&w=800&q=60'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{post.authorName}</span>
                  <span>{post.readingTime} דקות קריאה</span>
                </div>
                
                <div className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center">
                  קרא עוד
                </div>
              </div>
            </article>
            </a>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">לא נמצאו מאמרים התואמים את החיפוש</p>
          </div>
        )}
      </div>
    </div>
  );
}