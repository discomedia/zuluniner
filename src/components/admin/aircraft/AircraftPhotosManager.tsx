'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { validateImageFile } from '@/lib/image-utils';
import { db } from '@/api/db';
import type { AircraftPhoto } from '@/types';

interface AircraftPhotosManagerProps {
  aircraftId: string;
  photos: AircraftPhoto[];
  onPhotosChange: (photos: AircraftPhoto[]) => void;
}

export default function AircraftPhotosManager({
  aircraftId,
  photos,
  onPhotosChange,
}: AircraftPhotosManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setProcessing(true);
    setUploading(true);
    
    try {
      const validFiles: File[] = [];

      // Validate files first
      for (const file of Array.from(files)) {
        const validation = validateImageFile(file);
        
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) {
        setProcessing(false);
        setUploading(false);
        return;
      }

      // Upload photos to server
      const response = await fetch(`/api/admin/aircraft/${aircraftId}/photos`, {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          validFiles.forEach((file) => {
            formData.append('photos', file);
          });
          return formData;
        })(),
      });

      if (!response.ok) {
        throw new Error('Failed to upload photos');
      }

      const result = await response.json();
      
      if (result.success && result.photos) {
        // Add new photos to the existing ones
        onPhotosChange([...photos, ...result.photos]);
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      setProcessing(false);
      setUploading(false);
    }
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

  const removePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`/api/admin/aircraft/${aircraftId}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      // Remove photo from local state
      onPhotosChange(photos.filter(p => p.id !== photoId));
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const movePhoto = async (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);

    // Update display order
    const updatedPhotos = newPhotos.map((photo, index) => ({
      ...photo,
      display_order: index
    }));

    // Optimistically update UI
    onPhotosChange(updatedPhotos);

    // Update server
    try {
      const response = await fetch(`/api/admin/aircraft/${aircraftId}/photos/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoOrders: updatedPhotos.map(photo => ({
            id: photo.id,
            display_order: photo.display_order
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder photos');
      }
    } catch (error) {
      console.error('Error reordering photos:', error);
      // Revert on error
      onPhotosChange(photos);
      alert('Failed to reorder photos. Please try again.');
    }
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
            Add more photos
          </p>
          <p className="text-sm">
            Drag photos here or click to upload
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => fileInputRef.current?.click()}
          className="mt-4"
          disabled={processing || uploading}
        >
          {processing ? 'Processing...' : uploading ? 'Uploading...' : 'Choose Photos'}
        </Button>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium">Photos ({photos.length})</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => {
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;
              
              return (
                <div 
                  key={photo.id} 
                  className={`relative group cursor-move transition-transform ${
                    isDragging ? 'opacity-50 scale-105' : ''
                  } ${isDragOver && !isDragging ? 'scale-105 ring-2 ring-primary-500' : ''}`}
                  draggable={!uploading}
                  onDragStart={(e) => handlePhotosDragStart(e, index)}
                  onDragOver={(e) => handlePhotosDragOver(e, index)}
                  onDragLeave={handlePhotosDragLeave}
                  onDrop={(e) => handlePhotosDrop(e, index)}
                  onDragEnd={handlePhotosDragEnd}
                >
                  <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={db.photos.getPhotoUrl(photo.storage_path)}
                      alt={photo.alt_text || `Photo ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                  </div>
                  
                  {/* Primary Badge */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded z-10">
                      Primary
                    </div>
                  )}

                  {/* Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg">
                    {/* Drag Handle */}
                    {!uploading && (
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="bg-black bg-opacity-70 text-white rounded p-1 cursor-move">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zM7 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zM7 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zM13 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 2zM13 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zM13 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={() => movePhoto(index, index - 1)}
                          className="w-6 h-6 bg-white rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                          title="Move left"
                          disabled={uploading}
                        >
                          ←
                        </button>
                      )}
                      {index < photos.length - 1 && (
                        <button
                          onClick={() => movePhoto(index, index + 1)}
                          className="w-6 h-6 bg-white rounded text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                          title="Move right"
                          disabled={uploading}
                        >
                          →
                        </button>
                      )}
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="w-6 h-6 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                        title="Remove"
                        disabled={uploading}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-600 truncate">
                    {photo.alt_text || photo.caption || `Photo ${index + 1}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h4 className="font-medium text-blue-900">Uploading Photos</h4>
              <p className="text-sm text-blue-800">
                Adding new photos to your listing...
              </p>
            </div>
          </div>
        </div>
      )}

      {photos.length === 0 && !uploading && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ No Photos</h4>
          <p className="text-sm text-yellow-800">
            This listing has no photos. Consider adding high-quality photos to increase buyer interest.
          </p>
        </div>
      )}
    </div>
  );
}