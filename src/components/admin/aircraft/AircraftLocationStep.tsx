'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftLocationStepProps {
  formData: AircraftFormData;
  updateFormData: (updates: Partial<AircraftFormData>) => void;
}

export default function AircraftLocationStep({
  formData,
  updateFormData,
}: AircraftLocationStepProps) {
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Mock airport lookup - in a real app you'd use an API
  const lookupAirport = async (code: string) => {
    if (code.length !== 3 && code.length !== 4) return;
    
    setIsLookingUp(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - replace with real airport lookup API
    const mockAirports: { [key: string]: { city: string; country: string; lat: number; lng: number } } = {
      'KJFK': { city: 'New York', country: 'United States', lat: 40.6413, lng: -73.7781 },
      'JFK': { city: 'New York', country: 'United States', lat: 40.6413, lng: -73.7781 },
      'KLAX': { city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
      'LAX': { city: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
      'KORD': { city: 'Chicago', country: 'United States', lat: 41.9742, lng: -87.9073 },
      'ORD': { city: 'Chicago', country: 'United States', lat: 41.9742, lng: -87.9073 },
      'KDEN': { city: 'Denver', country: 'United States', lat: 39.8617, lng: -104.6731 },
      'DEN': { city: 'Denver', country: 'United States', lat: 39.8617, lng: -104.6731 },
    };

    const airport = mockAirports[code.toUpperCase()];
    if (airport) {
      updateFormData({
        city: airport.city,
        country: airport.country,
        latitude: airport.lat,
        longitude: airport.lng,
      });
    }
    
    setIsLookingUp(false);
  };

  const handleAirportCodeChange = (code: string) => {
    updateFormData({ airport_code: code.toUpperCase() });
    
    if (code.length >= 3) {
      lookupAirport(code);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Input
            label="Airport Code"
            value={formData.airport_code}
            onChange={(e) => handleAirportCodeChange(e.target.value)}
            placeholder="e.g., KJFK or JFK"
            maxLength={4}
            required
          />
          {isLookingUp && (
            <p className="text-sm text-blue-600 mt-1">Looking up airport...</p>
          )}
        </div>

        <Input
          label="City"
          value={formData.city}
          onChange={(e) => updateFormData({ city: e.target.value })}
          placeholder="e.g., New York"
          required
        />

        <Input
          label="Country"
          value={formData.country}
          onChange={(e) => updateFormData({ country: e.target.value })}
          placeholder="e.g., United States"
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            type="number"
            value={formData.latitude || ''}
            onChange={(e) => updateFormData({ latitude: parseFloat(e.target.value) || undefined })}
            step="any"
            placeholder="40.6413"
          />
          <Input
            label="Longitude"
            type="number"
            value={formData.longitude || ''}
            onChange={(e) => updateFormData({ longitude: parseFloat(e.target.value) || undefined })}
            step="any"
            placeholder="-73.7781"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📍 Location Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use the official ICAO code (4 letters) or IATA code (3 letters)</li>
          <li>• The system will automatically look up city and coordinates</li>
          <li>• Accurate location helps buyers find aircraft in their area</li>
          <li>• You can manually adjust coordinates if needed</li>
        </ul>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Location Preview</h4>
          <p className="text-sm text-gray-600">
            <strong>{formData.airport_code}</strong> - {formData.city}, {formData.country}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
          </p>
        </div>
      )}

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Privacy Note</h4>
        <p className="text-sm text-yellow-800">
          Only the airport code, city, and country will be displayed publicly. 
          Exact coordinates are used for search radius calculations but are not shown to buyers.
        </p>
      </div>
    </div>
  );
}