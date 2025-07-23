'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';
import type { Tables } from '@/api/schema';

interface AuthContextType {
  user: User | null;
  profile: Tables<'users'> | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Tables<'users'> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // console.log('🔍 Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('❌ Error fetching profile:', error);
        setProfile(null);
        return;
      }
      
      //console.log('✅ Profile fetched successfully:', profile);
      setProfile(profile);
    } catch (error) {
      console.error('❌ Unexpected error fetching profile:', error);
      setProfile(null);
    }
  }, [supabase]);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          // Check if it's the expected "session missing" error
          if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
            console.log('ℹ️ No active session (user not logged in)');
          } else {
            console.error('❌ Unexpected auth error:', error);
          }
          setUser(null);
          setProfile(null);
        } else {
          // console.log('👤 User from getUser:', user ? `${user.email} (${user.id})` : 'No user');
          setUser(user);
          
          if (user) {
            await fetchProfile(user.id);
          }
        }
      } catch (error: unknown) {
        // Handle any unexpected errors gracefully
        console.error('❌ Error initializing auth:', error);
        setUser(null);
        setProfile(null);
      } finally {
        //console.log('✅ Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // console.log('🔄 Auth state change:', event, session?.user ? `${session.user.email} (${session.user.id})` : 'No user');
        
        try {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('❌ Error handling auth state change:', error);
          setUser(null);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}