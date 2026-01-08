'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (!token || !userParam) {
      console.error('[AUTH] Missing token or user parameter');
      router.push('/login?error=missing_credentials');
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      
      // Validate user object
      if (!user || !user.id || !user.email) {
        console.error('[AUTH] Invalid user data structure');
        router.push('/login?error=invalid_user_data');
        return;
      }

      // Login user
      login(token, user);

      // Redirect based on role with fallback
      const role = user.role || 'USER';
      let redirectPath = '/';

      if (role === 'ADMIN') {
        redirectPath = '/admin';
      } else if (role === 'SELLER') {
        redirectPath = '/dashboard';
      }

      router.push(redirectPath);
    } catch (error) {
      console.error('[AUTH] Error processing callback:', error);
      router.push('/login?error=processing_failed');
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
