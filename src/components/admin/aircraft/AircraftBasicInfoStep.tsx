'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import AutoPopulateModal from '@/components/ui/AutoPopulateModal';
import { config } from '@/config/config';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftBasicInfoStepProps {
  formData: AircraftFormData;
  updateFormData: (updates: Partial<AircraftFormData>) => void;
}

export default function AircraftBasicInfoStep({
  formData,
  updateFormData,
}: AircraftBasicInfoStepProps) {
  const [isAutoPopulating, setIsAutoPopulating] = useState(false);
  const [autoPopulateProgress, setAutoPopulateProgress] = useState(0);
  const [autoPopulateMessage, setAutoPopulateMessage] = useState('');

  const generateSlug = (title: string, year: number, make: string, model: string) => {
    return `${year}-${make}-${model}-${title}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    updateFormData({ title });
    
    // Auto-generate meta description if not set
    if (!formData.meta_description && title && formData.year && formData.make && formData.model) {
      const metaDescription = `${formData.year} ${formData.make} ${formData.model} - ${title}. View specifications, photos, and contact seller on ZuluNiner.`;
      updateFormData({ meta_description: metaDescription });
    }
  };

  const handleAutoPopulate = async () => {
    if (!formData.title.trim()) {
      alert('Please enter an aircraft title first');
      return;
    }

    setIsAutoPopulating(true);
    setAutoPopulateProgress(0);
    setAutoPopulateMessage('Initializing AI search...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAutoPopulateProgress((prev) => {
          const newProgress = prev + 5;
          if (newProgress <= 20) {
            setAutoPopulateMessage('Searching aircraft databases...');
          } else if (newProgress <= 60) {
            setAutoPopulateMessage('Analyzing specifications...');
          } else if (newProgress <= 90) {
            setAutoPopulateMessage('Populating form fields...');
          } else {
            setAutoPopulateMessage('Finalizing data...');
          }
          return Math.min(newProgress, 95);
        });
      }, config.autoPopulate.progressUpdateInterval);

      const response = await fetch('/api/admin/aircraft/auto-populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formData.title }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to auto-populate');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Update form data with AI-generated information
        updateFormData({
          make: data.make || formData.make,
          model: data.model || formData.model,
          year: data.year || formData.year,
          title: data.title || formData.title,
          description: data.description || formData.description,
          price: data.price || formData.price,
          hours: data.hours || formData.hours,
          engine_type: data.engine_type || formData.engine_type,
          avionics: data.avionics || formData.avionics,
          airport_code: data.location?.airport_code || formData.airport_code,
          city: data.location?.city || formData.city,
          country: data.location?.country || formData.country,
          meta_description: data.meta_description || formData.meta_description,
        });

        setAutoPopulateProgress(100);
        setAutoPopulateMessage('Auto-population completed successfully!');
      } else {
        throw new Error(result.error || 'Failed to auto-populate');
      }
    } catch (error) {
      console.error('Auto-populate error:', error);
      setAutoPopulateProgress(0);
      setAutoPopulateMessage('Error occurred during auto-population');
      alert(error instanceof Error ? error.message : 'Failed to auto-populate aircraft information');
      setIsAutoPopulating(false);
    }
  };

  const handleModalClose = () => {
    setIsAutoPopulating(false);
    setAutoPopulateProgress(0);
    setAutoPopulateMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Aircraft Title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., 1978 Piper Archer II – Low Time Engine, Garmin Avionics"
                required
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAutoPopulate}
              disabled={!formData.title.trim() || isAutoPopulating}
              className="whitespace-nowrap"
            >
              ✨ Auto-populate
            </Button>
          </div>
        </div>

        <Input
          label="Year"
          type="number"
          value={formData.year}
          onChange={(e) => updateFormData({ year: parseInt(e.target.value) || 0 })}
          min="1900"
          max={new Date().getFullYear() + 1}
          required
        />

        <Input
          label="Price (USD)"
          type="number"
          value={formData.price}
          onChange={(e) => updateFormData({ price: parseFloat(e.target.value) || 0 })}
          min="0"
          required
        />

        <Input
          label="Make"
          value={formData.make}
          onChange={(e) => updateFormData({ make: e.target.value })}
          placeholder="e.g., Cessna, Piper, Beechcraft"
          required
        />

        <Input
          label="Model"
          value={formData.model}
          onChange={(e) => updateFormData({ model: e.target.value })}
          placeholder="e.g., 172, Cherokee, Bonanza"
          required
        />
      </div>

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => updateFormData({ description: e.target.value })}
        rows={6}
        placeholder="Provide a detailed description of the aircraft, its condition, maintenance history, and any notable features..."
        required
      />

      <Input
        label="Meta Description (SEO)"
        value={formData.meta_description || ''}
        onChange={(e) => updateFormData({ meta_description: e.target.value })}
        placeholder="Brief description for search engines (155 characters recommended)"
        maxLength={160}
        helpText="This appears in search engine results. Will be auto-generated if left blank."
      />

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Preview URL</h4>
        <p className="text-sm text-gray-600">
          zuluniner.com/aircraft/{formData.title && formData.year && formData.make && formData.model 
            ? generateSlug(formData.title, formData.year, formData.make, formData.model)
            : 'your-aircraft-slug'
          }
        </p>
      </div>

      <AutoPopulateModal
        isOpen={isAutoPopulating}
        onClose={handleModalClose}
        progress={autoPopulateProgress}
        message={autoPopulateMessage}
      />
    </div>
  );
}