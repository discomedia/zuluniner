import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '../components/layouts/MainLayout';
import ContainerLayout from '../components/layouts/ContainerLayout';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import HomePageClient from '../components/home/HomePageClient';
import { db } from '../api/db';
import type { Aircraft, AircraftPhoto } from '../types';

interface AircraftWithPhotos extends Aircraft {
  photos?: AircraftPhoto[];
}

export default async function Home() {
  console.log('🔄 Starting to fetch featured aircraft...');
  
  let featuredAircraft: AircraftWithPhotos[] = [];
  const loading = false;
  
  try {
    console.log('📞 Calling searchAircraft with params:', {}, 1, 3);
    const result = await db.aircraft.search({}, 1, 3);
    console.log('✅ searchAircraft result:', result);
    console.log('📊 Aircraft count:', result.aircraft?.length);
    featuredAircraft = result.aircraft;
    console.log('🎯 Featured aircraft loaded');
  } catch (error) {
    console.error('❌ Error fetching featured aircraft:', error);
  }

  return (
    <MainLayout>
      <HomePageClient>
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
                  const photoUrl = primaryPhoto?.storage_path ? db.photos.getPhotoUrl(primaryPhoto.storage_path) : null;
                  
                  return (
                    <Link key={aircraft.id} href={`/aircraft/${aircraft.slug}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Link href="/aircraft">
                <Button size="lg">
                  View All Aircraft
                </Button>
              </Link>
            </div>
          </ContainerLayout>
        </section>
      </HomePageClient>
    </MainLayout>
  );
}