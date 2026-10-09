export const revalidate = 3600;

import { Metadata } from 'next';
import AircraftListingsContent, { AircraftListingsPreview } from '@/components/aircraft/AircraftListingsContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Aircraft for Sale - Premium Aircraft Marketplace | ZuluNiner',
  description: 'Browse our extensive collection of quality aircraft for sale from trusted sellers. Find your perfect aircraft with detailed specifications, photos, and seller information.',
  keywords: 'aircraft for sale, airplane marketplace, aviation, aircraft listings, buy aircraft, sell aircraft',
  openGraph: {
    title: 'Aircraft for Sale - ZuluNiner',
    description: 'Browse our extensive collection of quality aircraft for sale from trusted sellers.',
    type: 'website',
    siteName: 'ZuluNiner',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aircraft for Sale - ZuluNiner',
    description: 'Browse our extensive collection of quality aircraft for sale from trusted sellers.',
  },
  alternates: {
    canonical: '/aircraft',
  },
};

import { getPublicAircraft } from '@/api/public-content';
import MainLayout from '@/components/layouts/MainLayout';

export default async function AircraftListingsPage() {
  const aircraft = await getPublicAircraft();
  return (
    <MainLayout>
      <Suspense fallback={<AircraftListingsPreview initialAircraft={aircraft} />}>
        <AircraftListingsContent initialAircraft={aircraft} />
      </Suspense>
    </MainLayout>
  );
}
