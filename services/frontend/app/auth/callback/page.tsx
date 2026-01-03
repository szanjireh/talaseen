'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    console.log('[AUTH CALLBACK] Starting callback processing...');
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log('[AUTH CALLBACK] Token exists:', !!token);
    console.log('[AUTH CALLBACK] User param exists:', !!userParam);

    if (token && userParam) {
      try {
        console.log('[AUTH CALLBACK] Parsing user data...');
        const user = JSON.parse(decodeURIComponent(userParam));
        console.log('[AUTH CALLBACK] User parsed successfully:', user.email);

        console.log('[AUTH CALLBACK] Calling login...');
        login(token, user);
        console.log('[AUTH CALLBACK] Login completed');

        // Redirect based on role
        console.log('[AUTH CALLBACK] Redirecting based on role:', user.role);
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            window.location.href = '/admin';
          } else if (user.role === 'SELLER') {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        }, 100);
      } catch (error) {
        console.error('[AUTH CALLBACK] Error:', error);
        window.location.href = '/login';
      }
    } else {
      console.log('[AUTH CALLBACK] Missing token or user, redirecting to login');
      window.location.href = '/login';
    }
  }, [searchParams, login]);

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
