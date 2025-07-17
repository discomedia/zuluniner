'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth';
import Loading from '@/components/ui/Loading';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '@/api/schema';

interface ClientProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/auth/login',
  fallback = <Loading />,
}: ClientProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'users'> | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user && requireAdmin) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setProfile(profile);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null);
          setProfile(null);
          if (requireAuth) {
            router.push(redirectTo);
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          if (requireAdmin) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            setProfile(profile);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, requireAuth, requireAdmin, redirectTo, router]);

  if (loading) {
    return fallback;
  }

  if (requireAuth && !user) {
    router.push(redirectTo);
    return fallback;
  }

  if (requireAdmin && (!profile || profile.role !== 'admin')) {
    router.push('/');
    return fallback;
  }

  return <>{children}</>;
}