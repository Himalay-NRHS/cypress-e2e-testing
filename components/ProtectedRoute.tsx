'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && !isAdmin) {
        router.push('/');
      }
    }
  }, [user, isLoading, isAdmin, adminOnly, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <PageLoader />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
