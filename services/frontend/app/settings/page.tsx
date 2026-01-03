'use client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import { Settings, User, Bell, Lock, Globe, LogOut } from 'lucide-react';

function SettingsContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'notifications' | 'security' | 'preferences'
  >('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    // TODO: Implement API call to update profile
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('تنظیمات با موفقیت ذخیره شد');
  };

  const handleLogout = () => {
    if (confirm('آیا از خروج از سیستم مطمئن هستید؟')) {
      logout();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-right bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold">تنظیمات</h1>
        </div>
        <p className="text-lg text-gray-600 mt-2">
          <span className="text-purple-600 font-semibold">مدیریت حساب کاربری و تنظیمات شخصی</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4 border-2 border-purple-100 bg-purple-50/50 sticky top-4">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-right transition-all ${
                  activeTab === 'profile'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>پروفایل</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-right transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>اطلاعات</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-right transition-all ${
                  activeTab === 'security'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>امنیت</span>
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-right transition-all ${
                  activeTab === 'preferences'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-purple-100'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>ترجیحات</span>
              </button>

              <hr className="my-4 border-purple-200" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-right text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="p-8 border-2 border-purple-100 bg-white">
              <h2 className="text-2xl font-bold text-right mb-6">اطلاعات پروفایل</h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`
                    }
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-purple-200"
                  />
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-purple-600 font-semibold mt-1">
                      {user?.role === 'ADMIN'
                        ? 'مدیر'
                        : user?.role === 'SELLER'
                          ? 'فروشنده'
                          : 'کاربر عادی'}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      نام
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-right"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      برای تغییر نام، از طریق حساب Google اقدام کنید
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      ایمیل
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="text-right"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      ایمیل شما در سیستم Google محفوظ است
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button disabled className="bg-gray-300 text-gray-700">
                    ذخیره تغییرات
                  </Button>
                  <p className="text-sm text-gray-600 flex items-center">
                    ℹ️ اطلاعات پروفایل شما از طریق حساب Google مدیریت می‌شود
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="p-8 border-2 border-purple-100 bg-white">
              <h2 className="text-2xl font-bold text-right mb-6">تنظیمات اطلاعات</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-900">اطلاعات محصولات جدید</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      دریافت اطلاع هنگام اضافه شدن محصولات جدید
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-900">اطلاعات قیمت</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      دریافت اطلاع هنگام تغییر قیمت محصولات دنبال شده
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-900">اطلاعات فروشندگان</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      دریافت پیشنهادات ویژه از فروشندگان دنبال شده
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-900">اطلاعات سایت</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      دریافت اطلاع در مورد بروزرسانی و اخبار سایت
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>

                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    ذخیره تنظیمات اطلاعات
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="p-8 border-2 border-purple-100 bg-white">
              <h2 className="text-2xl font-bold text-right mb-6">تنظیمات امنیتی</h2>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">احراز هویت با Google</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    حساب شما از طریق Google OAuth محفوظ است. برای امنیت بیشتر، تنظیمات حساب Google
                    خود را مدیریت کنید.
                  </p>
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    ← مدیریت حساب Google
                  </a>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-4 text-right">
                    فعالیت‌های اخیر
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ آخرین ورود: امروز</p>
                    <p>✓ مرورگر: Chrome</p>
                    <p>✓ دستگاه: Windows</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">خطر: خروج از تمام دستگاه‌ها</h4>
                  <p className="text-sm text-red-800 mb-3">
                    از تمام دستگاه‌های دیگر خارج شوید و به همه فعالیت‌های ورود دسترسی دوباره دهید.
                  </p>
                  <Button variant="destructive" disabled className="bg-red-600">
                    خروج از تمام دستگاه‌ها
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card className="p-8 border-2 border-purple-100 bg-white">
              <h2 className="text-2xl font-bold text-right mb-6">ترجیحات</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                    زبان
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right bg-white">
                    <option>فارسی</option>
                    <option>English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                    منطقه زمانی
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right bg-white">
                    <option>تهران (GMT+3:30)</option>
                    <option>دبی (GMT+4:00)</option>
                    <option>استانبول (GMT+3:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3 text-right">
                    فرمت نمایش قیمت
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-right bg-white">
                    <option>تومان (تومان)</option>
                    <option>دلار (USD)</option>
                    <option>یورو (EUR)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="text-right flex-1">
                    <h4 className="font-semibold text-gray-900">نمایش تیره</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      استفاده از رنگ‌های تیره برای راحتی بیشتر
                    </p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>

                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    ذخیره ترجیحات
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']}>
      <SettingsContent />
    </ProtectedRoute>
  );
}
