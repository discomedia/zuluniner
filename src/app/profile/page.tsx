'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import type { Tables } from '@/api/schema';

function ProfileForm() {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<Tables<'users'>>>({
    name: '',
    email: '',
    company: '',
    phone: '',
    location: '',
    role: 'buyer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        company: profile.company || '',
        phone: profile.phone || '',
        location: profile.location || '',
        role: profile.role as 'buyer' | 'seller' | 'admin' || 'buyer',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError('You must be logged in to update your profile');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          company: formData.company,
          phone: formData.phone,
          location: formData.location,
          role: formData.role,
        })
        .eq('id', user.id);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      await refreshProfile();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-6">
          Profile updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              disabled
              className="bg-gray-50"
              placeholder="Email cannot be changed here"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed from this form
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Account Type
          </label>
          <Select
            id="role"
            name="role"
            value={formData.role || 'buyer'}
            onChange={handleChange}
            disabled={profile?.role === 'admin'}
          >
            <option value="buyer">Buyer - I&apos;m looking to purchase aircraft</option>
            <option value="seller">Seller - I want to list aircraft for sale</option>
            {profile?.role === 'admin' && (
              <option value="admin">Administrator</option>
            )}
          </Select>
          {profile?.role === 'admin' && (
            <p className="mt-1 text-xs text-gray-500">
              Admin role cannot be changed
            </p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company (Optional)
          </label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company || ''}
            onChange={handleChange}
            placeholder="Enter your company name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location (Optional)
            </label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="City, State/Country"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (profile) {
                setFormData({
                  name: profile.name || '',
                  email: profile.email || '',
                  company: profile.company || '',
                  phone: profile.phone || '',
                  location: profile.location || '',
                  role: profile.role as 'buyer' | 'seller' | 'admin' || 'buyer',
                });
              }
              setError(null);
              setSuccess(false);
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ContainerLayout>
        <PageHeader
          title="Profile Settings"
          description="Update your account information and preferences"
        />
        <ProfileForm />
      </ContainerLayout>
    </ProtectedRoute>
  );
}