'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterAircraft, filtersFromParams } from '@/lib/aircraft-search';
import { Grid, List, Filter } from 'lucide-react';
import type { Aircraft, AircraftPhoto, SearchFilters } from '@/types';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import Loading from '@/components/ui/Loading';
import Alert from '@/components/ui/Alert';
import AircraftCard from '@/components/aircraft/AircraftCard';
import AircraftListItem from '@/components/aircraft/AircraftListItem';
import AircraftFilters from '@/components/aircraft/AircraftFilters';
import { AircraftListingPageStructuredData } from '@/components/seo/StructuredData';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'price_low' | 'price_high';

interface AircraftWithPhotos extends Aircraft {
  photos?: AircraftPhoto[];
  user?: {
    name: string;
    phone?: string | null;
    email: string;
  } | null;
}

interface AircraftListingsContentProps {
  initialAircraft: AircraftWithPhotos[];
}

export default function AircraftListingsContent({ initialAircraft }: AircraftListingsContentProps) {
  const params = useSearchParams();
  const sort = params.get('sort');
  const initialSort: SortOption = sort === 'oldest' || sort === 'price_low' || sort === 'price_high' ? sort : 'newest';
  return <AircraftListingsResults
    key={params.toString()}
    inventory={initialAircraft}
    initialFilters={filtersFromParams(new URLSearchParams(params.toString()))}
    initialSort={initialSort}
    initialView={params.get('view') === 'list' ? 'list' : 'grid'}
    initialPage={Math.max(1, Math.trunc(Number(params.get('page'))) || 1)}
  />;
}

// Render real listings in the static HTML while URL-specific client state hydrates.
export function AircraftListingsPreview({ initialAircraft }: AircraftListingsContentProps) {
  return <AircraftListingsResults inventory={initialAircraft} initialFilters={{}} initialSort="newest" initialView="grid" initialPage={1} />;
}

function AircraftListingsResults({ inventory, initialFilters, initialSort, initialView, initialPage }: {
  inventory: AircraftWithPhotos[]; initialFilters: SearchFilters; initialSort: SortOption; initialView: ViewMode; initialPage: number;
}) {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(initialView);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const itemsPerPage = viewMode === 'list' ? 8 : 12;
  const matches = filterAircraft(inventory, filters, sortBy);
  const totalItems = matches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedPage = Math.min(currentPage, Math.max(1, totalPages));
  const aircraft = matches.slice((displayedPage - 1) * itemsPerPage, displayedPage * itemsPerPage);
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPrimaryPhoto = (photos: AircraftPhoto[] = []): AircraftPhoto | undefined => {
    return photos.find(photo => photo.is_primary) || photos[0];
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  if (loading && aircraft.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading aircraft..." />
      </div>
    );
  }

  return (
    <>
      <AircraftListingPageStructuredData
        totalAircraft={totalItems}
        currentPage={displayedPage}
        itemsPerPage={itemsPerPage}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aircraft for Sale</h1>
          <p className="text-gray-600">
            Browse our selection of quality aircraft from trusted sellers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <SearchBar
              placeholder="Search aircraft by make, model, or keyword..."
              onSearch={handleSearch}
              value={filters.query}
            />

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={showFilters ? 'primary' : 'ghost'}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.keys(filters).length > (filters.query ? 1 : 0) && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    {Object.keys(filters).length - (filters.query ? 1 : 0)}
                  </span>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <AircraftFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            )}
          </div>
        </div>

        {/* Results */}
        {error ? (
          <Alert variant="error" className="mb-8">
            {error}
          </Alert>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? (
                  'Loading...'
                ) : (
                  `${totalItems} aircraft found`
                )}
              </p>
              
              {loading && aircraft.length > 0 && (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Updating...</span>
                </div>
              )}
            </div>

            {/* Aircraft Grid/List */}
            {aircraft.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No aircraft found matching your criteria</p>
                <Button
                  variant="primary"
                  onClick={() => {
                    setFilters({});
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {aircraft.map((item) => (
                      <AircraftCard
                        key={item.id}
                        aircraft={item}
                        primaryPhoto={getPrimaryPhoto(item.photos)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-8">
                    {aircraft.map((item) => (
                      <AircraftListItem
                        key={item.id}
                        aircraft={item}
                        primaryPhoto={getPrimaryPhoto(item.photos)}
                        seller={item.user}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={displayedPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        </div>
      </div>
    </>
  );
}
