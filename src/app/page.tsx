'use client';

import MainLayout from '../components/layouts/MainLayout';
import ContainerLayout from '../components/layouts/ContainerLayout';
import Button from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import SearchBar from '../components/ui/SearchBar';

export default function Home() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const featuredAircraft = [
    {
      id: 1,
      title: "Cessna 172 Skyhawk",
      price: "$95,000",
      year: "2018",
      hours: "450 TT",
      location: "Dallas, TX",
      image: "/placeholder-aircraft.jpg"
    },
    {
      id: 2,
      title: "Piper Cherokee PA-28",
      price: "$68,000",
      year: "2015",
      hours: "920 TT",
      location: "Miami, FL",
      image: "/placeholder-aircraft.jpg"
    },
    {
      id: 3,
      title: "Cirrus SR22",
      price: "$475,000",
      year: "2020",
      hours: "180 TT",
      location: "Los Angeles, CA",
      image: "/placeholder-aircraft.jpg"
    }
  ];

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
                <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100">
                  Browse Aircraft
                </Button>
                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-primary-500">
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
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAircraft.map((aircraft) => (
              <Card key={aircraft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-neutral-200 flex items-center justify-center">
                  <div className="text-neutral-500 text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    <p className="text-sm">Aircraft Photo</p>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{aircraft.title}</CardTitle>
                      <CardDescription>{aircraft.year} • {aircraft.hours}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{aircraft.price}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-500">
                      📍 {aircraft.location}
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg">
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
              <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-neutral-100">
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
