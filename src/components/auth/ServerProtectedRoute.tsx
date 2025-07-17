import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/auth-server';

interface ServerProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export async function ServerProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = '/auth/login',
}: ServerProtectedRouteProps) {
  if (!requireAuth && !requireAdmin) {
    return <>{children}</>;
  }

  const user = await getUser();

  if (!user) {
    redirect(redirectTo);
  }

  if (requireAdmin) {
    const profile = await getUserProfile();
    
    if (!profile || profile.role !== 'admin') {
      redirect('/');
    }
  }

  return <>{children}</>;
}