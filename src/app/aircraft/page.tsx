import { Metadata } from 'next';
import AircraftListingsContent from '@/components/aircraft/AircraftListingsContent';
type SearchParamsObject = Record<string, string | string[] | undefined>;

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

import { db } from '@/api/db';
import type { SearchFilters } from '@/types';
import MainLayout from '@/components/layouts/MainLayout';

function parseFilters(searchParams: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {};
  if (searchParams.get('q')) filters.query = searchParams.get('q')!;
  if (searchParams.get('price_min')) filters.priceMin = parseInt(searchParams.get('price_min')!);
  if (searchParams.get('price_max')) filters.priceMax = parseInt(searchParams.get('price_max')!);
  if (searchParams.get('make')) filters.make = searchParams.get('make')!;
  if (searchParams.get('model')) filters.model = searchParams.get('model')!;
  if (searchParams.get('engine_type')) filters.engineType = searchParams.get('engine_type')!;
  if (searchParams.get('year_min')) filters.yearMin = parseInt(searchParams.get('year_min')!);
  if (searchParams.get('year_max')) filters.yearMax = parseInt(searchParams.get('year_max')!);
  // Add more as needed
  return filters;
}

export default async function AircraftListingsPage({ searchParams }: { searchParams?: Promise<SearchParamsObject> }) {
  const searchParamsObj: SearchParamsObject = (await searchParams) ?? {};
  // Parse filters and pagination from URL
  const params = new URLSearchParams(
    Object.entries(searchParamsObj).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map(val => [k, val]) : v ? [[k, v]] : []
    )
  );
  const filters = parseFilters(params);

  const sort = params.get('sort') as string | null;
  const page = parseInt(params.get('page') || '1', 10);
  const view = params.get('view') as string | null;
  const itemsPerPage = view === 'list' ? 8 : 12;

  // Fetch aircraft server-side
  const result = await db.aircraft.search(filters, page, itemsPerPage);

  // Pass all relevant state to the client component
  return (
    <MainLayout>
      <AircraftListingsContent
        initialAircraft={result.aircraft}
        initialTotal={result.total}
        initialPage={page}
        initialFilters={filters}
        initialSort={sort || 'newest'}
        initialView={view || 'grid'}
        itemsPerPage={itemsPerPage}
      />
    </MainLayout>
  );
}