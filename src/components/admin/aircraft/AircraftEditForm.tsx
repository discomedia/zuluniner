'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import AircraftPhotosManager from './AircraftPhotosManager';
import type { Aircraft, AircraftPhoto } from '@/types';

interface AircraftEditFormProps {
  aircraft: Aircraft;
  initialPhotos?: AircraftPhoto[];
}

export default function AircraftEditForm({ aircraft, initialPhotos = [] }: AircraftEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<AircraftPhoto[]>(initialPhotos);
  const [formData, setFormData] = useState({
    title: aircraft.title,
    description: aircraft.description || '',
    price: aircraft.price,
    year: aircraft.year,
    make: aircraft.make,
    model: aircraft.model,
    hours: aircraft.hours || 0,
    engine_type: aircraft.engine_type || '',
    avionics: aircraft.avionics || '',
    airport_code: aircraft.airport_code || '',
    city: aircraft.city || '',
    country: aircraft.country || '',
    latitude: aircraft.latitude,
    longitude: aircraft.longitude,
    meta_description: aircraft.meta_description || '',
    status: aircraft.status,
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/aircraft/${aircraft.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update aircraft');
      }

      router.push('/admin/aircraft');
    } catch (error) {
      console.error('Error updating aircraft:', error);
      alert('Failed to update aircraft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Basic Information</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="aircraft-title"
              label="Title"
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              required
              className="md:col-span-2"
            />

            <Input
              id="aircraft-year"
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => updateFormData({ year: parseInt(e.target.value) || 0 })}
              required
            />

            <Input
              id="aircraft-price"
              label="Price (USD)"
              type="number"
              value={formData.price}
              onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
              required
            />

            <Input
              id="aircraft-make"
              label="Make"
              value={formData.make}
              onChange={(e) => updateFormData({ make: e.target.value })}
              required
            />

            <Input
              id="aircraft-model"
              label="Model"
              value={formData.model}
              onChange={(e) => updateFormData({ model: e.target.value })}
              required
            />
          </div>

          <div className="mt-6">
            <Textarea
              id="aircraft-description"
              label="Description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={6}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Specifications</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="aircraft-hours"
              label="Total Hours"
              type="number"
              value={formData.hours}
              onChange={(e) => updateFormData({ hours: parseFloat(e.target.value) || 0 })}
              required
            />

            <Input
              id="aircraft-engine-type"
              label="Engine Type"
              value={formData.engine_type}
              onChange={(e) => updateFormData({ engine_type: e.target.value })}
              required
            />

            <Input
              id="aircraft-avionics"
              label="Avionics"
              value={formData.avionics}
              onChange={(e) => updateFormData({ avionics: e.target.value })}
              required
              className="md:col-span-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Location</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="aircraft-airport-code"
              label="Airport Code"
              value={formData.airport_code}
              onChange={(e) => updateFormData({ airport_code: e.target.value })}
              required
            />

            <Input
              id="aircraft-city"
              label="City"
              value={formData.city}
              onChange={(e) => updateFormData({ city: e.target.value })}
              required
            />

            <Input
              id="aircraft-country"
              label="Country"
              value={formData.country}
              onChange={(e) => updateFormData({ country: e.target.value })}
              required
            />

            <Select
              id="aircraft-status"
              label="Status"
              value={formData.status || 'draft'}
              onChange={(e) => updateFormData({ status: e.target.value as 'draft' | 'active' | 'pending' | 'sold' })}
              required
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Photos</h2>
        </CardHeader>
        <CardContent>
          <AircraftPhotosManager
            aircraftId={aircraft.id}
            photos={photos}
            onPhotosChange={setPhotos}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">SEO & Meta</h2>
        </CardHeader>
        <CardContent>
          <Input
            id="aircraft-meta-description"
            label="Meta Description"
            value={formData.meta_description}
            onChange={(e) => updateFormData({ meta_description: e.target.value })}
            maxLength={160}
            helpText="Brief description for search engines (155 characters recommended)"
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
        >
          Cancel
        </Button>

        <div className="flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}