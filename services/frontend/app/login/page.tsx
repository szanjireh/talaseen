'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function LoginPage() {
  const { isAuthenticated, user, isLoading, login } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'google' | 'sms'>('google');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Don't redirect while still loading
    if (isLoading) return;

    if (isAuthenticated && user) {
      console.log('[LOGIN PAGE] Already authenticated, redirecting...');
      // Redirect based on role
      if (user.role === 'ADMIN') {
        router.replace('/admin');
      } else if (user.role === 'SELLER') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoogleLogin = () => {
    window.location.href = api.auth.googleLogin();
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 11) {
      setError('لطفاً شماره موبایل معتبر وارد کنید');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(api.auth.sendOtp(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setCountdown(300); // 5 minutes
      } else {
        setError(data.message || 'خطا در ارسال کد تایید');
      }
    } catch (err) {
      setError('خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('لطفاً کد 6 رقمی را وارد کنید');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(api.auth.verifyOtp(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        login(data.access_token, data.user);

        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else if (data.user.role === 'SELLER') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setError(data.message || 'کد تایید نامعتبر است');
      }
    } catch (err) {
      setError('خطا در تایید کد');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpCode('');
    setOtpSent(false);
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center">
      {/* Logo at top */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="container mx-auto">
          <a
            href="/"
            className="inline-block text-3xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
          >
            طلاسین
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: Illustration / branding */}
          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/images/login-hero.jpg"
                alt="گالری طلا"
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop';
                }}
              />
            </div>
          </div>

          {/* Right: Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white dark:bg-[#0b1220] rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white font-vazirmatn">
                  خوش آمدید به طلاسین
                </h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  برای ورود یکی از روش‌های زیر را انتخاب کنید
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button
                  onClick={() => setActiveTab('google')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'google'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  گوگل
                </button>
                <button
                  onClick={() => setActiveTab('sms')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'sms'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  پیامک
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Google Login Tab */}
              {activeTab === 'google' && (
                <div className="space-y-4">
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full inline-flex items-center justify-center gap-3 bg-white border border-gray-200 hover:shadow-md px-4 py-3 rounded-lg text-sm font-medium shadow-sm transition-all"
                    aria-label="Login with Google"
                  >
                    <span className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          fill="#EA4335"
                          d="M12 11.5v3.1h4.4c-.2 1.2-.9 2.3-1.9 3.1l3 2.3c1.8-1.6 2.9-4 2.9-6.9 0-.7-.1-1.4-.2-2.1H12z"
                        />
                        <path
                          fill="#34A853"
                          d="M6.5 14c-.5-1-.8-2.1-.8-3.2s.3-2.2.8-3.2L3.5 5.3C2.2 7.1 1.5 9.5 1.5 12c0 2.5.7 4.9 2 6.7l3-2.7z"
                        />
                        <path
                          fill="#4A90E2"
                          d="M12 4.5c1 0 1.9.3 2.7.9l2-2C16.8 2.1 14.6 1 12 1 7.8 1 3.9 3.4 2.4 7.6l3 2.7C7.1 8 9.4 6.5 12 6.5z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M4.5 18.7c1.5 2.9 4.9 4.8 8.5 4.8 3.2 0 6-1.4 7.9-3.6l-3-2.3c-1 1-2.4 1.7-4 1.7-2.9 0-5.3-1.9-6.1-4.6l-3.3 1.9z"
                        />
                      </svg>
                    </span>
                    <span className="text-sm text-gray-800">ورود با Google</span>
                  </button>
                </div>
              )}

              {/* SMS Login Tab */}
              {activeTab === 'sms' && (
                <div className="space-y-4">
                  {!otpSent ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          شماره موبایل
                        </label>
                        <Input
                          type="tel"
                          placeholder="09123456789"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={11}
                          className="text-center text-lg tracking-wider"
                          disabled={loading}
                        />
                      </div>
                      <Button
                        onClick={handleSendOtp}
                        disabled={loading || !phone}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                      >
                        {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          کد تایید (6 رقمی)
                        </label>
                        <Input
                          type="text"
                          placeholder="------"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          maxLength={6}
                          className="text-center text-2xl tracking-widest font-mono"
                          disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          کد به شماره {phone} ارسال شد
                        </p>
                      </div>
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={loading || otpCode.length !== 6}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                      >
                        {loading ? 'در حال تایید...' : 'تایید و ورود'}
                      </Button>
                      {countdown > 0 ? (
                        <p className="text-xs text-center text-gray-500">
                          ارسال مجدد کد تا {Math.floor(countdown / 60)}:
                          {(countdown % 60).toString().padStart(2, '0')} دقیقه
                        </p>
                      ) : (
                        <button
                          onClick={handleResendOtp}
                          className="text-sm text-amber-600 hover:underline w-full text-center"
                        >
                          ارسال مجدد کد
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="text-center text-xs text-gray-500 mt-4">
                با ادامه، با شرایط استفاده و سیاست حفظ حریم خصوصی موافقت می‌کنید
              </div>

              <div className="pt-4 text-center">
                <a href="/" className="text-sm text-orange-600 hover:underline">
                  بازگشت به صفحه اصلی
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
