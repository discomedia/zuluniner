'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
  initialMode?: 'signin' | 'signup';
}

export default function SignInModal({ isOpen, onClose, redirectTo = '/admin', initialMode = 'signin' }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(initialMode === 'signup');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (showRegister) {
        // Handle registration
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const { data, error } = await signUp(email, password, name);

        if (error) {
          setError(error.message);
          return;
        }

        if (data.user) {
          setSuccessMessage('Account created successfully! Please check your email to verify your account.');
          // Don't close modal immediately, let user see success message
          setTimeout(() => {
            onClose();
            setSuccessMessage(null);
          }, 3000);
        }
      } else {
        // Handle sign in
        const { data, error } = await signIn(email, password);

        if (error) {
          setError(error.message);
          return;
        }

        if (data.user) {
          onClose();
          router.push(redirectTo);
          router.refresh();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
    setShowRegister(initialMode === 'signup');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="sm"
      className="max-w-md bg-white shadow-2xl"
    >
      <div className="text-center mb-6">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          {showRegister ? 'Join ZuluNiner' : 'Welcome Back'}
        </h2>
        <p className="text-neutral-600">
          {showRegister 
            ? 'Create your account to start buying and selling aircraft' 
            : 'Sign in to access your ZuluNiner account'
          }
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {showRegister && (
          <div>
            <label htmlFor="modal-name" className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <Input
              id="modal-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              autoComplete="name"
              className="w-full"
            />
          </div>
        )}

        <div>
          <label htmlFor="modal-email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email Address
          </label>
          <Input
            id="modal-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            autoComplete="email"
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="modal-password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <Input
            id="modal-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            autoComplete={showRegister ? "new-password" : "current-password"}
            className="w-full"
          />
        </div>

        {showRegister && (
          <div>
            <label htmlFor="modal-confirm-password" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm Password
            </label>
            <Input
              id="modal-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="w-full"
            />
          </div>
        )}

        {!showRegister && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link 
                href="/auth/reset-password" 
                className="text-primary-600 hover:text-primary-700 hover:underline"
                onClick={handleClose}
              >
                Forgot password?
              </Link>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {showRegister ? 'Creating account...' : 'Signing in...'}
            </div>
          ) : (
            showRegister ? 'Create Account' : 'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">or</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          {showRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setShowRegister(!showRegister)}
            className="text-primary-600 hover:text-primary-700 hover:underline font-medium focus:outline-none"
          >
            {showRegister ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>

      {/* Quick sign-in for testing - only show in sign-in mode */}
      {!showRegister && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-amber-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-amber-800 font-medium">Development Mode</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('zulufingniner999@zuluniner.com');
              setPassword('n0Tas4nd!ch');
            }}
            className="text-xs text-amber-700 hover:text-amber-900 underline focus:outline-none"
          >
            Fill admin credentials for testing
          </button>
        </div>
      )}
    </Modal>
  );
}
