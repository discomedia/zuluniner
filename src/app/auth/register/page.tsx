'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Alert from '@/components/ui/Alert';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        setSuccess(true);
        // Don't redirect immediately - let user know to check email
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <ContainerLayout>
        <PageHeader
          title="Check Your Email"
          description="We've sent you a verification link"
        />
        
        <div className="max-w-md mx-auto">
          <Alert variant="success" className="mb-6">
            <div>
              <h3 className="text-sm font-medium">Registration successful!</h3>
              <p className="mt-1 text-sm">
                Please check your email and click the verification link to complete your account setup.
              </p>
            </div>
          </Alert>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn&apos;t receive the email? Check your spam folder.
            </p>
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout>
      <PageHeader
        title="Create Account"
        description="Join the ZuluNiner community"
      />
      
      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              autoComplete="name"
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
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="buyer">Buyer - I&apos;m looking to purchase aircraft</option>
              <option value="seller">Seller - I want to list aircraft for sale</option>
            </Select>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password (min. 6 characters)"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </ContainerLayout>
  );
}