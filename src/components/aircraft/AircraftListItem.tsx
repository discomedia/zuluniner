import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Plane, Phone, Mail } from 'lucide-react';
import { supabase } from '@/api/supabase';
import type { AircraftCardProps } from '@/types';
import Button from '@/components/ui/Button';

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
  return new Intl.NumberFormat('en-US').format(hours) + ' hrs';
}

interface AircraftListItemProps extends AircraftCardProps {
  seller?: {
    name: string;
    phone?: string;
    email: string;
  };
}

export default function AircraftListItem({ aircraft, primaryPhoto, seller }: AircraftListItemProps) {
  const photoUrl = primaryPhoto ? 
    supabase.storage.from('aircraft-photos').getPublicUrl(primaryPhoto.storage_path).data.publicUrl : 
    null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row">
        {/* Photo */}
        <Link href={`/aircraft/${aircraft.slug}`} className="group md:w-80 md:flex-shrink-0">
          <div className="relative aspect-[4/3] md:aspect-[3/2] bg-gray-100">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={primaryPhoto?.alt_text || aircraft.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Plane className="h-16 w-16" />
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            {/* Main Content */}
            <div className="flex-1">
              {/* Title and Price */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                <div>
                  <Link href={`/aircraft/${aircraft.slug}`} className="group">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {aircraft.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-lg">
                    {aircraft.year} {aircraft.make} {aircraft.model}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(aircraft.price)}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="font-medium">{aircraft.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Total Time</p>
                    <p className="font-medium">{formatHours(aircraft.hours)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium truncate">
                      {aircraft.location?.city}, {aircraft.location?.country}
                    </p>
                  </div>
                </div>

                {aircraft.location?.airport_code && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Plane className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Airport</p>
                      <p className="font-medium font-mono">{aircraft.location.airport_code}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {aircraft.description && (
                <p className="text-gray-600 line-clamp-2 mb-4">
                  {aircraft.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {aircraft.engine_type && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    {aircraft.engine_type}
                  </span>
                )}
                {aircraft.avionics && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                    {aircraft.avionics}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:w-48 lg:flex-shrink-0">
              <Link href={`/aircraft/${aircraft.slug}`}>
                <Button variant="primary" className="w-full">
                  View Details
                </Button>
              </Link>
              
              {seller && (
                <>
                  {seller.phone && (
                    <Button
                      variant="secondary"
                      onClick={() => window.location.href = `tel:${seller.phone}`}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call Seller
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    onClick={() => window.location.href = `mailto:${seller.email}?subject=Inquiry about ${aircraft.title}`}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Seller
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}