'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface Aircraft {
  id: string;
  title: string;
  year: number | null;
  make: string | null;
  model: string | null;
  price: number;
  status: string | null;
  slug: string;
  created_at: string | null;
  photos?: Array<{ id: string }>;
}

interface AircraftListClientProps {
  aircraft: Aircraft[];
  total: number;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  aircraftTitle: string;
  isDeleting: boolean;
}

function DeleteModal({ isOpen, onClose, onConfirm, aircraftTitle, isDeleting }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Aircraft Listing
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete &ldquo;{aircraftTitle}&rdquo;? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button 
            variant="ghost" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AircraftListClient({ aircraft: initialAircraft, total }: AircraftListClientProps) {
  const [aircraft, setAircraft] = useState(initialAircraft);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    aircraftId: string;
    aircraftTitle: string;
  }>({
    isOpen: false,
    aircraftId: '',
    aircraftTitle: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (aircraftId: string, aircraftTitle: string) => {
    setDeleteModal({
      isOpen: true,
      aircraftId,
      aircraftTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/admin/aircraft/${deleteModal.aircraftId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        // Remove the aircraft from the list
        setAircraft(prev => prev.filter(a => a.id !== deleteModal.aircraftId));
        setDeleteModal({ isOpen: false, aircraftId: '', aircraftTitle: '' });
      } else {
        console.error('Failed to delete aircraft:', result.error);
        alert('Failed to delete aircraft. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      alert('Failed to delete aircraft. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, aircraftId: '', aircraftTitle: '' });
  };

  return (
    <>
      {aircraft.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No aircraft listings found.</p>
          <Link href="/admin/aircraft/new">
            <Button variant="primary">
              Create Your First Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-2 font-medium">Aircraft</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Price</th>
                <th className="pb-2 font-medium">Photos</th>
                <th className="pb-2 font-medium">Created</th>
                <th className="pb-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {aircraft.map((aircraft) => (
                <tr key={aircraft.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{aircraft.title}</div>
                      <div className="text-gray-500 text-xs">
                        {aircraft.year} {aircraft.make} {aircraft.model}
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      aircraft.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : aircraft.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : aircraft.status === 'pending'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {aircraft.status ? aircraft.status.charAt(0).toUpperCase() + aircraft.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-3">
                    ${aircraft.price.toLocaleString()}
                  </td>
                  <td className="py-3">
                    {aircraft.photos?.length || 0} photos
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(aircraft.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Link href={`/admin/aircraft/${aircraft.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/aircraft/${aircraft.slug}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(aircraft.id, aircraft.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        aircraftTitle={deleteModal.aircraftTitle}
        isDeleting={isDeleting}
      />
    </>
  );
}