'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { SearchFilters } from '@/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface AircraftFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

// Common aircraft makes for the dropdown
const aircraftMakes = [
  'Beechcraft', 'Cessna', 'Cirrus', 'Diamond', 'Embraer', 'Gulfstream',
  'Hawker', 'King Air', 'Learjet', 'Mooney', 'Piper', 'Robinson',
  'Bell', 'Airbus', 'Boeing', 'Bombardier', 'Dassault', 'Honda',
  'Pilatus', 'Quest', 'Socata', 'TBM', 'Viking', 'Zlin'
].sort();

// Common engine types
const engineTypes = [
  'Single Piston', 'Twin Piston', 'Single Turboprop', 'Twin Turboprop',
  'Single Jet', 'Twin Jet', 'Electric', 'Rotorcraft'
].sort();

export default function AircraftFilters({ filters, onFiltersChange }: AircraftFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters };
    
    if (value === '' || value === undefined) {
      delete newFilters[field];
    } else {
      (newFilters as Record<string, unknown>)[field] = value;
    }
    
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = localFilters.query ? { query: localFilters.query } : {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const makeOptions = [
    { value: '', label: 'Any Make' },
    ...aircraftMakes.map(make => ({ value: make, label: make }))
  ];

  const engineTypeOptions = [
    { value: '', label: 'Any Engine Type' },
    ...engineTypes.map(type => ({ value: type, label: type }))
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'Any Year' },
    ...Array.from({ length: 50 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    })
  ];

  const activeFilterCount = Object.keys(localFilters).length - (localFilters.query ? 1 : 0);

  return (
    <div className="border-t border-gray-200 pt-6 space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Price ($)"
            type="number"
            placeholder="e.g., 50000"
            value={localFilters.priceMin?.toString() || ''}
            onChange={(e) => handleInputChange('priceMin', e.target.value ? parseInt(e.target.value) : undefined)}
          />
          <Input
            label="Maximum Price ($)"
            type="number"
            placeholder="e.g., 500000"
            value={localFilters.priceMax?.toString() || ''}
            onChange={(e) => handleInputChange('priceMax', e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Year Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Year Range</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Minimum Year"
            value={localFilters.yearMin?.toString() || ''}
            onChange={(e) => handleInputChange('yearMin', e.target.value ? parseInt(e.target.value) : undefined)}
          >
            {yearOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="Maximum Year"
            value={localFilters.yearMax?.toString() || ''}
            onChange={(e) => handleInputChange('yearMax', e.target.value ? parseInt(e.target.value) : undefined)}
          >
            {yearOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Make and Model */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Aircraft Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Make"
            value={localFilters.make || ''}
            onChange={(e) => handleInputChange('make', e.target.value || undefined)}
          >
            {makeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Input
            label="Model"
            placeholder="e.g., 172, Citation, King Air"
            value={localFilters.model || ''}
            onChange={(e) => handleInputChange('model', e.target.value || undefined)}
          />
        </div>
      </div>

      {/* Engine Type */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Engine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Engine Type"
            value={localFilters.engineType || ''}
            onChange={(e) => handleInputChange('engineType', e.target.value || undefined)}
          >
            {engineTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleApplyFilters}
        >
          Apply Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFilterCount > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.priceMin && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Min Price: ${localFilters.priceMin.toLocaleString()}
              </span>
            )}
            {localFilters.priceMax && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Max Price: ${localFilters.priceMax.toLocaleString()}
              </span>
            )}
            {localFilters.yearMin && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Min Year: {localFilters.yearMin}
              </span>
            )}
            {localFilters.yearMax && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Max Year: {localFilters.yearMax}
              </span>
            )}
            {localFilters.make && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Make: {localFilters.make}
              </span>
            )}
            {localFilters.model && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Model: {localFilters.model}
              </span>
            )}
            {localFilters.engineType && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Engine: {localFilters.engineType}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}