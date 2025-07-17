'use client';

import { useEffect, useState } from 'react';

interface AutoPopulateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: number;
  message: string;
}

export default function AutoPopulateModal({ isOpen, onClose, progress, message }: AutoPopulateModalProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setDisplayProgress(progress);
    } else {
      setDisplayProgress(0);
    }
  }, [progress, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">✨</div>
          <h3 className="text-lg font-semibold text-gray-900">Auto-Populating Aircraft Info</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="text-center text-sm text-gray-600">
            {displayProgress}% Complete
          </div>

          {/* Status Steps */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className={`flex items-center space-x-2 ${displayProgress >= 20 ? 'text-green-600' : ''}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                displayProgress >= 20 ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}>
                {displayProgress >= 20 && <span className="w-2 h-2 bg-white rounded-full" />}
              </span>
              <span>Searching aircraft databases...</span>
            </div>
            <div className={`flex items-center space-x-2 ${displayProgress >= 60 ? 'text-green-600' : ''}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                displayProgress >= 60 ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}>
                {displayProgress >= 60 && <span className="w-2 h-2 bg-white rounded-full" />}
              </span>
              <span>Analyzing specifications...</span>
            </div>
            <div className={`flex items-center space-x-2 ${displayProgress >= 90 ? 'text-green-600' : ''}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                displayProgress >= 90 ? 'bg-green-600 border-green-600' : 'border-gray-300'
              }`}>
                {displayProgress >= 90 && <span className="w-2 h-2 bg-white rounded-full" />}
              </span>
              <span>Populating form fields...</span>
            </div>
          </div>
        </div>

        {displayProgress === 100 && (
          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}