'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import SearchBar from '@/components/ui/SearchBar';

interface HomePageClientProps {
  children: React.ReactNode;
}

export default function HomePageClient({ children }: HomePageClientProps) {
  const router = useRouter();

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

  return (
    <>
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
    </>
  );
}