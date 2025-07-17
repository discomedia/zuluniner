'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/api/supabase';
import type { AircraftPhoto } from '@/types';
import Modal from '@/components/ui/Modal';

interface PhotoGalleryProps {
  photos: AircraftPhoto[];
  aircraftTitle: string;
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  
  const sortedPhotos = photos ? [...photos].sort((a, b) => a.display_order - b.display_order) : [];

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < sortedPhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedPhotoIndex === null) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        if (selectedPhotoIndex > 0) {
          setSelectedPhotoIndex(selectedPhotoIndex - 1);
        }
        break;
      case 'ArrowRight':
        if (selectedPhotoIndex < sortedPhotos.length - 1) {
          setSelectedPhotoIndex(selectedPhotoIndex + 1);
        }
        break;
      case 'Escape':
        setSelectedPhotoIndex(null);
        break;
    }
  }, [selectedPhotoIndex, sortedPhotos.length]);

  // Add keyboard event listener when lightbox is open
  useEffect(() => {
    if (selectedPhotoIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedPhotoIndex, handleKeyDown]);

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Image
              src={supabase.storage.from('aircraft-photos').getPublicUrl(photo.storage_path).data.publicUrl}
              alt={photo.alt_text}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {photo.is_primary && (
              <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <Modal
          isOpen={true}
          onClose={closeLightbox}
          title=""
          className="max-w-7xl"
        >
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {sortedPhotos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  disabled={selectedPhotoIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={goToNext}
                  disabled={selectedPhotoIndex === sortedPhotos.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Photo */}
            <div className="relative w-full h-[80vh] bg-black rounded-lg overflow-hidden">
              <Image
                src={supabase.storage.from('aircraft-photos').getPublicUrl(sortedPhotos[selectedPhotoIndex].storage_path).data.publicUrl}
                alt={sortedPhotos[selectedPhotoIndex].alt_text}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Photo Info */}
            <div className="mt-4 text-center">
              <p className="text-gray-900 font-medium">
                {sortedPhotos[selectedPhotoIndex].alt_text}
              </p>
              {sortedPhotos[selectedPhotoIndex].caption && (
                <p className="text-gray-600 text-sm mt-1">
                  {sortedPhotos[selectedPhotoIndex].caption}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                {selectedPhotoIndex + 1} of {sortedPhotos.length}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}