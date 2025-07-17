import { Metadata } from 'next';
import { Suspense } from 'react';
import AircraftListingsContent from '@/components/aircraft/AircraftListingsContent';

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

export default function AircraftListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AircraftListingsContent />
    </Suspense>
  );
}