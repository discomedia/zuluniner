'use client';

import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { AircraftFormData } from './AircraftWizard';

interface AircraftSpecsStepProps {
  formData: AircraftFormData;
  updateFormData: (updates: Partial<AircraftFormData>) => void;
}

const ENGINE_TYPES = [
  'Single Engine Piston',
  'Twin Engine Piston',
  'Single Engine Turboprop',
  'Twin Engine Turboprop',
  'Single Engine Jet',
  'Twin Engine Jet',
  'Electric',
  'Other',
];

const POPULAR_AVIONICS = [
  'Garmin G1000',
  'Garmin G3X Touch',
  'Garmin GTN 650/750',
  'Garmin GNS 430/530',
  'Avidyne IFD440/540',
  'Bendix/King',
  'Basic VFR',
  'IFR Certified',
  'WAAS GPS',
  'Glass Cockpit',
  'Steam Gauges',
];

export default function AircraftSpecsStep({
  formData,
  updateFormData,
}: AircraftSpecsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Total Hours"
          type="number"
          value={formData.hours}
          onChange={(e) => updateFormData({ hours: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.1"
          placeholder="e.g., 1250.5"
          required
        />

        <Select
          label="Engine Type"
          value={formData.engine_type}
          onChange={(e) => updateFormData({ engine_type: e.target.value })}
          required
        >
          <option value="">Select engine type</option>
          {ENGINE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avionics Package
          </label>
          <Select
            value={formData.avionics}
            onChange={(e) => updateFormData({ avionics: e.target.value })}
            required
          >
            <option value="">Select primary avionics</option>
            {POPULAR_AVIONICS.map(avionics => (
              <option key={avionics} value={avionics}>{avionics}</option>
            ))}
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Choose the primary avionics system. You can provide more details in the description.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be accurate with hours - buyers will verify during inspection</li>
          <li>• Include engine hours separately in the description if significantly different</li>
          <li>• Mention recent upgrades or overhauls in the description</li>
          <li>• Add details about autopilot, GPS, and other equipment in the description</li>
        </ul>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Additional Equipment Details</h4>
        <p className="text-sm text-gray-600">
          Use the description field to provide detailed information about:
        </p>
        <ul className="text-sm text-gray-600 mt-2 ml-4 space-y-1">
          <li>• Specific avionics models and software versions</li>
          <li>• Engine and propeller details</li>
          <li>• Interior and exterior condition</li>
          <li>• Recent maintenance and inspections</li>
          <li>• Additional equipment and modifications</li>
        </ul>
      </div>
    </div>
  );
}