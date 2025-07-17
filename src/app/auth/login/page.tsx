'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import ContainerLayout from '@/components/layouts/ContainerLayout';
import PageHeader from '@/components/layouts/PageHeader';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerLayout>
      <PageHeader
        title="Sign In"
        description="Welcome back to ZuluNiner"
      />
      
      <div className="max-w-md mx-auto">
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                href="/auth/reset-password" 
                className="text-primary hover:text-primary/80 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </ContainerLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}