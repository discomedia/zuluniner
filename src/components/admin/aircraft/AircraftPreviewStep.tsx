'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Image from 'next/image';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftPreviewStepProps {
  formData: AircraftFormData;
  photos: File[];
  setPhotos?: (photos: File[]) => void;
}

export default function AircraftPreviewStep({
  formData,
  photos,
  setPhotos,
}: AircraftPreviewStepProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const generateSlug = (title: string, year: number, make: string, model: string) => {
    return `${year}-${make}-${model}-${title}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (!setPhotos) return;
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(newPhotos);
  };

  const handlePhotosDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePhotosDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handlePhotosDragLeave = () => {
    setDragOverIndex(null);
  };

  const handlePhotosDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      movePhoto(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePhotosDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const slug = generateSlug(formData.title, formData.year, formData.make, formData.model);

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      <div className={`p-4 rounded-lg ${
        formData.status === 'active' 
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <h4 className={`font-medium mb-1 ${
          formData.status === 'active' ? 'text-green-900' : 'text-yellow-900'
        }`}>
          {formData.status === 'active' ? '✅ Ready to Publish' : '📝 Saving as Draft'}
        </h4>
        <p className={`text-sm ${
          formData.status === 'active' ? 'text-green-800' : 'text-yellow-800'
        }`}>
          {formData.status === 'active' 
            ? 'This listing will be immediately visible to buyers'
            : 'This listing will be saved as a draft and can be published later'
          }
        </p>
      </div>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Listing Preview</h3>
          <p className="text-sm text-gray-600">
            This is how your listing will appear to buyers
          </p>
        </CardHeader>
        <CardContent>
          {/* Hero Image */}
          {photos.length > 0 && (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-6 group">
              <Image
                src={URL.createObjectURL(photos[0])}
                alt="Primary aircraft photo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute bottom-4 left-4 bg-primary-600 text-white text-sm px-3 py-1 rounded">
                Primary Photo
              </div>
              {setPhotos && photos.length > 1 && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black bg-opacity-70 text-white text-sm px-3 py-1 rounded">
                    Drag photos below to change primary
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Title and Price */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {formData.year} {formData.make} {formData.model}
              </h1>
              <p className="text-lg text-gray-600">{formData.title}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                ${formData.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{formData.year}</div>
              <div className="text-sm text-gray-600">Year</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{formData.hours.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{formData.engine_type}</div>
              <div className="text-sm text-gray-600">Engine</div>
            </div>
            <div>
              <div className="font-medium text-gray-900">{formData.avionics}</div>
              <div className="text-sm text-gray-600">Avionics</div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center mb-6">
            <span className="text-gray-900 font-medium">📍</span>
            <span className="ml-2 text-gray-600">
              {formData.airport_code} - {formData.city}, {formData.country}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {formData.description || 'No description provided.'}
            </div>
          </div>

          {/* Photo Gallery Preview */}
          {photos.length > 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Photos ({photos.length})
                {setPhotos && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    • Drag to reorder
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {photos.slice(0, 6).map((photo, index) => {
                  const isDragging = draggedIndex === index;
                  const isDragOver = dragOverIndex === index;
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative aspect-square bg-gray-100 rounded overflow-hidden group ${
                        setPhotos ? 'cursor-move' : ''
                      } transition-transform ${
                        isDragging ? 'opacity-50 scale-105' : ''
                      } ${isDragOver && !isDragging ? 'scale-105 ring-2 ring-primary-500' : ''}`}
                      draggable={!!setPhotos}
                      onDragStart={setPhotos ? (e) => handlePhotosDragStart(e, index) : undefined}
                      onDragOver={setPhotos ? (e) => handlePhotosDragOver(e, index) : undefined}
                      onDragLeave={setPhotos ? handlePhotosDragLeave : undefined}
                      onDrop={setPhotos ? (e) => handlePhotosDrop(e, index) : undefined}
                      onDragEnd={setPhotos ? handlePhotosDragEnd : undefined}
                    >
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 16vw"
                        unoptimized
                      />
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-primary-600 text-white text-xs px-1 py-0.5 rounded">
                          Primary
                        </div>
                      )}
                      {setPhotos && (
                        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black bg-opacity-70 text-white rounded p-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zM7 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zM7 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zM13 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 2zM13 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zM13 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"/>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {photos.length > 6 && (
                  <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-sm text-gray-600">
                      +{photos.length - 6} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* URL Preview */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Listing URL</h4>
          <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
            zuluniner.com/aircraft/{slug}
          </code>
        </CardContent>
      </Card>

      {/* SEO Preview */}
      {formData.meta_description && (
        <Card>
          <CardHeader>
            <h4 className="font-medium">Search Engine Preview</h4>
          </CardHeader>
          <CardContent>
            <div className="border rounded p-3 bg-white">
              <div className="text-blue-600 hover:underline text-sm mb-1">
                zuluniner.com/aircraft/{slug}
              </div>
              <div className="text-purple-700 text-lg leading-tight mb-1">
                {formData.year} {formData.make} {formData.model} - {formData.title}
              </div>
              <div className="text-gray-600 text-sm">
                {formData.meta_description}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Checklist */}
      <Card>
        <CardHeader>
          <h4 className="font-medium">Pre-publish Checklist</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { check: formData.title, label: 'Aircraft title provided' },
              { check: formData.description.length > 50, label: 'Detailed description (50+ characters)' },
              { check: formData.price > 0, label: 'Price set' },
              { check: formData.make && formData.model, label: 'Make and model specified' },
              { check: formData.hours >= 0, label: 'Hours specified' },
              { check: formData.engine_type, label: 'Engine type selected' },
              { check: formData.avionics, label: 'Avionics specified' },
              { check: formData.airport_code && formData.city, label: 'Location provided' },
              { check: photos.length > 0, label: 'At least one photo uploaded' },
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <span className={`mr-2 ${item.check ? 'text-green-600' : 'text-red-600'}`}>
                  {item.check ? '✅' : '❌'}
                </span>
                <span className={item.check ? 'text-gray-900' : 'text-red-600'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}