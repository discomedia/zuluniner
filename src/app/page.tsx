'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '../components/layouts/MainLayout';
import ContainerLayout from '../components/layouts/ContainerLayout';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';
import { searchAircraft } from '../api/db';
import type { Aircraft, AircraftPhoto } from '../types';

interface AircraftWithPhotos extends Aircraft {
  photos?: AircraftPhoto[];
}

export default function Home() {
  const router = useRouter();
  const [featuredAircraft, setFeaturedAircraft] = useState<AircraftWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleViewAllAircraft = () => {
    router.push('/aircraft');
  };

  const handleSellAircraft = () => {
    router.push('/sell');
  };

  const handleListAircraft = () => {
    router.push('/sell');
  };

  useEffect(() => {
    const fetchFeaturedAircraft = async () => {
      console.log('🔄 Starting to fetch featured aircraft...');
      try {
        console.log('📞 Calling searchAircraft with params:', {}, 1, 3);
        const result = await searchAircraft({}, 1, 3);
        console.log('✅ searchAircraft result:', result);
        console.log('📊 Aircraft count:', result.aircraft?.length);
        setFeaturedAircraft(result.aircraft);
        console.log('🎯 Featured aircraft state updated');
      } catch (error) {
        console.error('❌ Error fetching featured aircraft:', error);
      } finally {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    };

    fetchFeaturedAircraft();
  }, []);


  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <ContainerLayout className="py-20 lg:py-28">
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
        </ContainerLayout>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-b border-neutral-200">
        <ContainerLayout className="py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="mt-2 text-lg text-neutral-600">Aircraft Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">1,200+</div>
              <div className="mt-2 text-lg text-neutral-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600">$45M+</div>
              <div className="mt-2 text-lg text-neutral-600">In Transactions</div>
            </div>
          </div>
        </ContainerLayout>
      </section>

      {/* Featured Aircraft */}
      <section className="bg-neutral-50">
        <ContainerLayout className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              Featured Aircraft
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Discover our handpicked selection of premium aircraft
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading featured aircraft...</p>
              <p className="text-xs text-neutral-400 mt-2">Loading state: {loading.toString()}</p>
            </div>
          ) : featuredAircraft.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <p className="text-xl text-neutral-600">No planes available right now :(</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAircraft.map((aircraft) => {
                const primaryPhoto = aircraft.photos?.find(p => p.is_primary) || aircraft.photos?.[0];
                const photoUrl = primaryPhoto?.storage_path ? `/api/photos/${primaryPhoto.storage_path}` : null;
                
                return (
                  <Card key={aircraft.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/aircraft/${aircraft.slug}`)}>
                    <div className="aspect-[4/3] bg-neutral-200 flex items-center justify-center relative">
                      {photoUrl ? (
                        <Image 
                          src={photoUrl} 
                          alt={primaryPhoto?.alt_text || `${aircraft.make} ${aircraft.model}`}
                          className="w-full h-full object-cover"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="text-neutral-500 text-center">
                          <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                          </svg>
                          <p className="text-sm">Aircraft Photo</p>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{aircraft.make} {aircraft.model}</CardTitle>
                          <CardDescription>{aircraft.year} • {aircraft.hours || 'TBD'} TT</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-600">
                            ${aircraft.price?.toLocaleString() || 'POA'}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-neutral-500">
                          📍 {aircraft.city || 'Location TBD'}
                        </div>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/aircraft/${aircraft.slug}`);
                        }}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Button size="lg" onClick={handleViewAllAircraft}>
              View All Aircraft
            </Button>
          </div>
        </ContainerLayout>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600">
        <ContainerLayout className="py-20">
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
        </ContainerLayout>
      </section>
    </MainLayout>
  );
}
