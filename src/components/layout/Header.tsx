'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { UserProfileDropdown } from '@/components/auth/UserProfileDropdown';

export function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Right side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              Vilala
            </Link>
          </div>
          
          {/* Center - Navigation */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              בית
            </Link>
            <Link href="/cabins" className="text-gray-700 hover:text-gray-900 font-medium">
              צימרים
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-gray-900 font-medium">
              בלוג
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              צור קשר
            </Link>
          </nav>

          {/* Left side - Auth + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Auth Section */}
            {session ? (
              <div className="flex items-center gap-3">
                {/* User Profile Dropdown */}
                <UserProfileDropdown />
                
                {/* Admin Link - Only show for admin users */}
                {session.user?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.50 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden sm:inline">ניהול צימרים</span>
                  </Link>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                התחברות
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <Link 
                href="/" 
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                בית
              </Link>
              <Link 
                href="/cabins" 
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                צימרים
              </Link>
              <Link 
                href="/blog" 
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                בלוג
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                צור קשר
              </Link>
              {session ? (
                <>
                  {/* Mobile User Profile */}
                  <div className="flex items-center gap-2 py-2 border-b border-gray-200 mb-2">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user?.name || 'User'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {session.user?.name}
                    </span>
                  </div>
                  
                  {/* Admin Link - Only show for admin users */}
                  {session.user?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ניהול צימרים
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block text-gray-700 hover:text-gray-900 font-medium py-2 w-full text-right"
                  >
                    התנתק
                  </button>
                </>
              ) : (
                <Link 
                  href="/auth/signin" 
                  className="block text-gray-700 hover:text-gray-900 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  התחברות
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}