'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Button from '@/components/ui/Button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();

  const navigation = [
    { name: 'Browse Aircraft', href: '/aircraft' },
    { name: 'Sell Aircraft', href: '/sell' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              ZuluNiner
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
            ) : user ? (
              <>
                <span className="text-sm text-neutral-600">
                  Welcome, {profile?.name || 'User'}
                </span>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-neutral-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-neutral-600 hover:text-primary-600 p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-neutral-200 pt-4 pb-3">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent"></div>
                  </div>
                ) : user ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-neutral-600">
                      Welcome, {profile?.name || 'User'}
                    </div>
                    {profile?.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="text-neutral-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="text-neutral-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-neutral-600 hover:text-primary-600 block w-full text-left px-3 py-2 text-base font-medium transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-neutral-600 hover:text-primary-600 block px-3 py-2 text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="bg-primary-600 hover:bg-primary-700 text-white block mx-3 mt-2 px-4 py-2 rounded-lg text-base font-medium transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}