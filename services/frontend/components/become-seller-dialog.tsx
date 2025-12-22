'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import { Store, X, CheckCircle, AlertCircle } from 'lucide-react';

interface BecomeSellerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BecomeSellerDialog({ isOpen, onClose }: BecomeSellerDialogProps) {
  const { token, user } = useAuth();
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shopName.trim()) {
      setError('لطفا نام فروشگاه را وارد کنید');
      return;
    }

    if (!token) {
      setError('لطفا ابتدا وارد شوید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(api.auth.requestSeller(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shopName: shopName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطا در ارسال درخواست');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setShopName('');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال درخواست');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setShopName('');
      setError('');
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          aria-label="بستن"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              درخواست شما ارسال شد!
            </h3>
            <p className="text-gray-600">
              درخواست فروشندگی شما در انتظار تایید مدیر است
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-3">
                <Store className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                درخواست فروشندگی
              </h2>
              <p className="text-gray-600 text-sm">
                با عضویت به عنوان فروشنده، محصولات طلای خود را به فروش برسانید
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  نام فروشگاه
                </label>
                <Input
                  id="shopName"
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="مثال: طلا و جواهر آرین"
                  className="text-right"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-right">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !shopName.trim()}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {loading ? 'در حال ارسال...' : 'ارسال درخواست'}
                </Button>
              </div>
            </form>

            <div className="mt-4 p-3 bg-gray-50 rounded-md text-right">
              <p className="text-xs text-gray-600">
                💡 پس از ارسال درخواست، مدیر سایت درخواست شما را بررسی و در صورت تایید، به شما اطلاع داده خواهد شد.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
