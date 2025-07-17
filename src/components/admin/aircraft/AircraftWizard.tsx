'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AircraftBasicInfoStep from './AircraftBasicInfoStep';
import AircraftSpecsStep from './AircraftSpecsStep';
import AircraftLocationStep from './AircraftLocationStep';
import AircraftPhotosStep from './AircraftPhotosStep';
import AircraftPreviewStep from './AircraftPreviewStep';
import type { AircraftPhoto } from '@/types';

export interface AircraftFormData {
  title: string;
  description: string;
  price: number;
  year: number;
  make: string;
  model: string;
  hours: number;
  engine_type: string;
  avionics: string;
  airport_code: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  meta_description?: string;
  status: 'draft' | 'active';
}

const STEPS = [
  { id: 1, title: 'Basic Info', component: AircraftBasicInfoStep },
  { id: 2, title: 'Specifications', component: AircraftSpecsStep },
  { id: 3, title: 'Location', component: AircraftLocationStep },
  { id: 4, title: 'Photos', component: AircraftPhotosStep },
  { id: 5, title: 'Preview', component: AircraftPreviewStep },
];

export default function AircraftWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [formData, setFormData] = useState<AircraftFormData>({
    title: '',
    description: '',
    price: 0,
    year: new Date().getFullYear(),
    make: '',
    model: '',
    hours: 0,
    engine_type: '',
    avionics: '',
    airport_code: '',
    city: '',
    country: '',
    status: 'draft',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<AircraftPhoto[]>([]);

  const updateFormData = (updates: Partial<AircraftFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (publishNow = false) => {
    setIsSubmitting(true);
    
    try {
      const finalData = {
        ...formData,
        status: publishNow ? 'active' as const : 'draft' as const,
      };

      let response: Response;

      if (photos.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('aircraft', JSON.stringify(finalData));
        
        // Add each photo file
        photos.forEach((photo) => {
          formData.append('photos', photo);
        });

        response = await fetch('/api/admin/aircraft', {
          method: 'POST',
          body: formData, // No Content-Type header - browser will set multipart/form-data
        });
      } else {
        // Use JSON for aircraft without photos
        response = await fetch('/api/admin/aircraft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            aircraft: finalData,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create aircraft');
      }

      await response.json();
      
      // Show success message briefly before redirecting
      setUploadSuccess(true);
      setTimeout(() => {
        // Redirect to the aircraft management page or the new aircraft
        router.push(`/admin/aircraft`);
      }, 2000);
    } catch (error) {
      console.error('Error creating aircraft:', error);
      alert(`Failed to create aircraft: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              <div className="ml-2 text-sm font-medium text-gray-800">
                {step.title}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 text-green-600">✓</div>
            <div>
              <h4 className="font-medium text-green-900">Upload Successful!</h4>
              <p className="text-sm text-green-800">
                Your aircraft listing has been created successfully. Redirecting to the aircraft management page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </h2>
        </CardHeader>
        <CardContent>
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            photos={photos}
            setPhotos={setPhotos}
            uploadedPhotos={uploadedPhotos}
            setUploadedPhotos={setUploadedPhotos}
            isUploading={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/aircraft')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
        </div>

        <div className="flex gap-2">
          {currentStep === STEPS.length ? (
            <>
              <Button
                variant="secondary"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  'Save as Draft'
                )}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {photos.length > 0 ? `Uploading ${photos.length} photos...` : 'Publishing...'}
                  </span>
                ) : (
                  'Publish Now'
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={nextStep}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}