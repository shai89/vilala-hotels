import { getArticles } from '@/lib/actions/blog';
import { BlogClient } from './blog-client';

export default async function BlogManagementPage() {
  let articles = [];
  
  try {
    articles = await getArticles();
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

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
            <a href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </a>
            <a href="/admin/cabins" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-700 text-purple-200 hover:text-white transition-colors">
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
            <a href="/admin/blog" className="flex items-center gap-3 p-3 rounded-lg bg-purple-700 text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              ניהול בלוג
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
              <div className="text-sm font-medium">מחובר כמנהל</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <BlogClient initialArticles={articles} />
    </div>
  );
}