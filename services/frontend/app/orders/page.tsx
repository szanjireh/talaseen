'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/protected-route';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShoppingBag, Home, AlertCircle } from 'lucide-react';

function OrdersContent() {
  const router = useRouter();
  const { user } = useAuth();

  // Placeholder for future orders implementation
  const orders: any[] = [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-right bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold">سفارش‌های من</h1>
        </div>
        <p className="text-lg text-gray-600 mt-2">
          <span className="text-blue-600 font-semibold">مدیریت و پیگیری سفارش‌های خریدی شما</span>
        </p>
      </div>

      <Card className="p-16 text-center bg-white shadow-xl border-2 border-blue-100">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">هنوز سفارشی ثبت نشده</h3>
          <p className="text-gray-600 mb-6">
            سیستم سفارش و پرداخت طلاسین هنوز در حال توسعه است. برای خریدار، لطفاً از طریق تماس
            مستقیم با فروشندگان اقدام کنید.
          </p>

          <div className="space-y-4 mt-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-right">
              <h4 className="font-bold text-blue-900 mb-2">نحوه خریداری:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ محصول مورد نظر را انتخاب کنید</li>
                <li>✓ اطلاعات فروشنده را مشاهده کنید</li>
                <li>✓ با فروشنده برای توافق قیمت و شرایط تماس بگیرید</li>
                <li>✓ انجام معاملات از طریق روش‌های معمول</li>
              </ul>
            </div>

            <Button
              onClick={() => router.push('/products')}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold shadow-lg"
            >
              <Home className="w-4 h-4 ml-2" />
              مرور محصولات
            </Button>

            <p className="text-xs text-gray-500 pt-4">
              سیستم سفارش آنلاین به زودی راه‌اندازی خواهد شد.
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Info Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-blue-100 bg-blue-50/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">📱</span>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-gray-900">تماس مستقیم</h4>
              <p className="text-sm text-gray-600 mt-1">
                با فروشندگان برای توافق قیمت و شرایط تماس بگیرید
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-blue-100 bg-blue-50/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🔒</span>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-gray-900">محفوظ و معتبر</h4>
              <p className="text-sm text-gray-600 mt-1">تمام فروشندگان تایید شده و معتبر هستند</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-blue-100 bg-blue-50/50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💬</span>
            </div>
            <div className="text-right">
              <h4 className="font-bold text-gray-900">پشتیبانی ۲۴/۷</h4>
              <p className="text-sm text-gray-600 mt-1">برای هر سؤال می‌توانید با ما تماس بگیرید</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
