import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Phone, Mail, MapPin, Calendar, Clock, Settings, Plane } from 'lucide-react';
import { db } from '@/api/db';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import PhotoGallery from '@/components/aircraft/PhotoGallery';
import ContactSeller from '@/components/aircraft/ContactSeller';
import ShareButtons from '@/components/aircraft/ShareButtons';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { AircraftStructuredData } from '@/components/seo/StructuredData';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getAircraftBySlug(slug: string) {
  return await db.aircraft.getBySlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const aircraft = await getAircraftBySlug(slug);
  
  if (!aircraft) {
    return {
      title: 'Aircraft Not Found - ZuluNiner',
    };
  }

  const primaryPhoto = aircraft.photos?.find((p) => p.is_primary === true) || aircraft.photos?.[0];
  const photoUrl = primaryPhoto ? 
    db.photos.getPhotoUrl(primaryPhoto.storage_path) : 
    undefined;

  return {
    title: `${aircraft.title} - ${aircraft.year} ${aircraft.make} ${aircraft.model} - ZuluNiner`,
    description: aircraft.meta_description || aircraft.description?.substring(0, 160),
    openGraph: {
      title: aircraft.title,
      description: aircraft.description?.substring(0, 160),
      images: photoUrl ? [{ url: photoUrl, alt: aircraft.title }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: aircraft.title,
      description: aircraft.description?.substring(0, 160),
      images: photoUrl ? [photoUrl] : [],
    },
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatHours(hours: number | null): string {
  if (!hours) return 'N/A';
  return new Intl.NumberFormat('en-US').format(hours);
}

export default async function AircraftDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const aircraft = await getAircraftBySlug(slug);

  if (!aircraft) {
    notFound();
  }

  const primaryPhoto = aircraft.photos?.find((p) => p.is_primary === true) || aircraft.photos?.[0];
  // const remainingPhotos = aircraft.photos?.filter((p) => !p.is_primary) || [];
  const primaryPhotoUrl = primaryPhoto ? 
    db.photos.getPhotoUrl(primaryPhoto.storage_path) : 
    undefined;

  const breadcrumbItems = [
    { name: 'Aircraft', href: '/aircraft' },
    { name: `${aircraft.year} ${aircraft.make} ${aircraft.model}`, href: `/aircraft/${aircraft.slug}` },
  ];

  const specifications = [
    { label: 'Make', value: aircraft.make, icon: Plane },
    { label: 'Model', value: aircraft.model, icon: Plane },
    { label: 'Year', value: aircraft.year.toString(), icon: Calendar },
    { label: 'Total Time', value: formatHours(aircraft.hours), icon: Clock },
    { label: 'Engine Type', value: aircraft.engine_type || 'N/A', icon: Settings },
    { label: 'Avionics', value: aircraft.avionics || 'N/A', icon: Settings },
    { label: 'Location', value: `${aircraft.city}, ${aircraft.country}`, icon: MapPin },
    { label: 'Airport Code', value: aircraft.airport_code || 'N/A', icon: MapPin },
  ];

  return (
    <>
      <AircraftStructuredData 
        aircraft={aircraft} 
        primaryPhotoUrl={primaryPhotoUrl}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Primary Photo */}
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
              {primaryPhoto ? (
                <Image
                  src={db.photos.getPhotoUrl(primaryPhoto.storage_path)}
                  alt={primaryPhoto.alt_text}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <Plane className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Aircraft Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {aircraft.title}
                </h1>
                <p className="text-xl text-gray-600">
                  {aircraft.year} {aircraft.make} {aircraft.model}
                </p>
                <p className="text-3xl font-bold text-blue-600 mt-4">
                  {formatPrice(aircraft.price)}
                </p>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{aircraft.city}, {aircraft.country}</span>
                </div>
                {aircraft.airport_code && (
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {aircraft.airport_code}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <ContactSeller aircraft={aircraft} />
                <ShareButtons aircraft={aircraft} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description and Photos */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {aircraft.description && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Description</h2>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {aircraft.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photo Gallery */}
            {aircraft.photos && aircraft.photos.length > 1 && (
              <Card>
                <CardHeader>
                  <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
                </CardHeader>
                <CardContent>
                  <PhotoGallery photos={aircraft.photos} aircraftTitle={aircraft.title} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Specifications and Contact */}
          <div className="space-y-8">
            {/* Specifications */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Specifications</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-2 text-gray-600">
                        <spec.icon className="h-4 w-4" />
                        <span className="font-medium">{spec.label}</span>
                      </div>
                      <span className="text-gray-900 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-gray-900">Seller Information</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-900">{aircraft.user.name}</p>
                    {aircraft.user.company && (
                      <p className="text-gray-600">{aircraft.user.company}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {aircraft.user.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a 
                          href={`tel:${aircraft.user.phone}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {aircraft.user.phone}
                        </a>
                      </div>
                    )}
                    
                  </div>

                  <Button variant="primary" className="w-full mt-4">
                    Enquire
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}