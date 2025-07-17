'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import { validateImageFile, optimizeImage } from '@/lib/image-utils';
import type { AircraftPhoto } from '@/types';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftPhotosStepProps {
  formData: AircraftFormData;
  updateFormData: (updates: Partial<AircraftFormData>) => void;
  photos: File[];
  setPhotos: (photos: File[]) => void;
  uploadedPhotos: AircraftPhoto[];
  setUploadedPhotos: (photos: AircraftPhoto[]) => void;
}

export default function AircraftPhotosStep({
  formData: _formData,
  photos,
  setPhotos,
}: AircraftPhotosStepProps) {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setProcessing(true);
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      const validation = validateImageFile(file);
      
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        continue;
      }

      // Optimize image before adding
      try {
        const optimized = await optimizeImage(file);
        validFiles.push(optimized.optimized);
      } catch (error) {
        console.error('Image optimization failed:', error);
        // Use original file if optimization fails
        validFiles.push(file);
      }
    }

    // Add optimized photos
    setPhotos([...photos, ...validFiles]);
    setProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    setPhotos(newPhotos);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="text-gray-600">
          <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-lg font-medium mb-2">
            Drag photos here or click to upload
          </p>
          <p className="text-sm">
            Supports: JPG, PNG, WebP • Max 10MB per file
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4"
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Choose Photos'}
        </Button>
      </div>

      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Photos ({photos.length})</h4>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPhotos([])}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={`${photo.name}-${index}`} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {index > 0 && (
                      <button
                        onClick={() => movePhoto(index, index - 1)}
                        className="w-6 h-6 bg-white rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {index < photos.length - 1 && (
                      <button
                        onClick={() => movePhoto(index, index + 1)}
                        className="w-6 h-6 bg-white rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                    <button
                      onClick={() => removePhoto(index)}
                      className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-xs text-gray-600 truncate">
                  {photo.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📸 Photo Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• The first photo will be the primary listing photo</li>
          <li>• Include exterior shots from multiple angles</li>
          <li>• Add interior photos showing cockpit, cabin, and avionics</li>
          <li>• Include close-ups of any damage or notable features</li>
          <li>• Engine and maintenance photos are valuable to buyers</li>
          <li>• Use good lighting - outdoor photos often work best</li>
        </ul>
      </div>

      {photos.length === 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Photos Required</h4>
          <p className="text-sm text-yellow-800">
            At least one photo is required to publish your listing. 
            Listings with more high-quality photos receive significantly more interest.
          </p>
        </div>
      )}
    </div>
  );
}