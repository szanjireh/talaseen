'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      {/* Logo at top */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="container mx-auto">
          <a href="/" className="inline-block text-3xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
            طلاسین
          </a>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">دسترسی رد شد</CardTitle>
          <CardDescription>شما دسترسی به این صفحه را ندارید</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            نقش شما: <span className="font-semibold">{user?.role || 'نامشخص'}</span>
          </p>
          
          {user?.role === 'USER' && (
            <p className="text-sm">
              شما می‌توانید درخواست فروشنده شدن را از پروفایل خود ارسال کنید
            </p>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={() => router.push('/')} variant="outline">
              صفحه اصلی
            </Button>
            <Button onClick={() => router.back()}>
              بازگشت
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
