'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword, updatePassword } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';

function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if this is a password reset link (has access_token and type=recovery)
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');
    
    if (accessToken && type === 'recovery') {
      setIsResetMode(true);
    }
  }, [searchParams]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success && !isResetMode) {
    return (
      <ContainerLayout>
        <PageHeader
          title="Check Your Email"
          description="Password reset link sent"
        />
        
        <div className="max-w-md mx-auto">
          <Alert variant="success" className="mb-6">
            <div>
              <h3 className="text-sm font-medium">Reset link sent!</h3>
              <p className="mt-1 text-sm">
                We&apos;ve sent a password reset link to {email}. 
                Click the link in your email to create a new password.
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

  if (success && isResetMode) {
    return (
      <ContainerLayout>
        <PageHeader
          title="Password Updated"
          description="Your password has been successfully changed"
        />
        
        <div className="max-w-md mx-auto">
          <Alert variant="success" className="mb-6">
            <div>
              <h3 className="text-sm font-medium">Password updated!</h3>
              <p className="mt-1 text-sm">
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
            </div>
          </Alert>
          
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </ContainerLayout>
    );
  }

  if (isResetMode) {
    return (
      <ContainerLayout>
        <PageHeader
          title="Create New Password"
          description="Enter your new password below"
        />
        
        <div className="max-w-md mx-auto">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your new password (min. 6 characters)"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout>
      <PageHeader
        title="Reset Password"
        description="Enter your email to receive a reset link"
      />
      
      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleRequestReset} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              autoComplete="email"
            />
            <p className="mt-2 text-sm text-gray-600">
              We&apos;ll send you a link to reset your password.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}