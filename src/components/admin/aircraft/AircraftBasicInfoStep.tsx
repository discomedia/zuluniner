'use client';

import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftBasicInfoStepProps {
  formData: AircraftFormData;
  updateFormData: (updates: Partial<AircraftFormData>) => void;
}

export default function AircraftBasicInfoStep({
  formData,
  updateFormData,
}: AircraftBasicInfoStepProps) {
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Aircraft Title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="e.g., Excellent condition, low hours"
          required
          className="md:col-span-2"
        />

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
    </div>
  );
}