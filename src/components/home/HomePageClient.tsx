'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/components/auth/AuthProvider';
import SignInModal from '@/components/auth/SignInModal';

interface HomePageClientProps {
  children: React.ReactNode;
}

export default function HomePageClient({ children }: HomePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  // Check for auth-related URL parameters
  useEffect(() => {
    const auth = searchParams.get('auth');
    const error = searchParams.get('error');
    
    if (auth === 'required' || auth === 'signin') {
      setAuthModalMode('signin');
      setIsSignInModalOpen(true);
    } else if (auth === 'signup') {
      setAuthModalMode('signup');
      setIsSignInModalOpen(true);
    }
    
    if (error) {
      // Show error message for auth callback errors
      console.error('Auth error from URL:', error);
    }

    // Clean up URL parameters after reading them
    if (auth || error) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      newUrl.searchParams.delete('error');
      newUrl.searchParams.delete('redirectTo');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setIsSignInModalOpen(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/aircraft?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/aircraft');
    }
  };

  const handleBrowseAircraft = () => {
    router.push('/aircraft');
  };

  const handleSellAircraft = () => {
    router.push('/sell');
  };

  const handleListAircraft = () => {
    router.push('/sell');
  };

  // Show admin quick actions for admin users
  const renderAdminSection = () => {
    if (!user || profile?.role !== 'admin') return null;

    return (
      <section className="bg-amber-50 border-l-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-amber-800">
                Admin Dashboard
              </h3>
              <p className="text-amber-700">Quick access to administrative functions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/aircraft">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Manage Aircraft
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">Add, edit, and manage aircraft listings</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/blog">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    </svg>
                    Manage Blog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">Create and manage blog posts</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Admin Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">Access full admin dashboard</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium text-neutral-900 flex items-center">
                    <svg className="h-5 w-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    My Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">View your personal dashboard</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  return (
    <>
      {/* Admin Section - only show for admin users */}
      {renderAdminSection()}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect Aircraft
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              The premier marketplace connecting pilots, dealers, and aviation enthusiasts worldwide. 
              Discover your next aircraft with confidence and trust.
            </p>
            <div className="mt-10 max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search aircraft by make, model, or location..."
                onSearch={handleSearch}
                size="lg"
                className="mb-6"
              />
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100" onClick={handleBrowseAircraft}>
                  Browse Aircraft
                </Button>
                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-primary-500" onClick={handleSellAircraft}>
                  Sell Your Aircraft
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the content */}
      {children}

      {/* CTA Section */}
      <section className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to List Your Aircraft?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Join thousands of sellers who trust ZuluNiner to connect them with qualified buyers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100" onClick={handleListAircraft}>
                List Your Aircraft
              </Button>
              <Button size="lg" variant="ghost" className="text-white border-white hover:bg-primary-500">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Auth Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={handleModalClose}
        redirectTo={searchParams.get('redirectTo') || '/dashboard'}
        initialMode={authModalMode}
      />
    </>
  );
}