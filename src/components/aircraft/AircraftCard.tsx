import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Clock, Plane } from 'lucide-react';
import { db } from '@/api/db';
import type { AircraftCardProps } from '@/types';

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

export default function AircraftCard({ aircraft, primaryPhoto }: AircraftCardProps) {
  const photoUrl = primaryPhoto ? 
    db.photos.getPhotoUrl(primaryPhoto.storage_path) : 
    null;

  return (
    <Link href={`/aircraft/${aircraft.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Photo */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={primaryPhoto?.alt_text || aircraft.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Plane className="h-16 w-16" />
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-lg shadow-lg">
            {formatPrice(aircraft.price)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {aircraft.title}
          </h3>

          {/* Aircraft Details */}
          <p className="text-gray-600 mb-3">
            {aircraft.year} {aircraft.make} {aircraft.model}
          </p>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{aircraft.year}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{formatHours(aircraft.hours)}</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-600 col-span-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {aircraft.city}, {aircraft.country}
                {aircraft.airport_code && (
                  <span className="ml-1 font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                    {aircraft.airport_code}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Description Preview */}
          {aircraft.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {aircraft.description}
            </p>
          )}

          {/* Additional Specs */}
          <div className="flex flex-wrap gap-2 text-xs">
            {aircraft.engine_type && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {aircraft.engine_type}
              </span>
            )}
            {aircraft.avionics && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {aircraft.avionics}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}