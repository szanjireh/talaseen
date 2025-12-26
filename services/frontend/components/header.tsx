'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Search, LogOut, User, Settings, Heart, ShoppingBag, LayoutDashboard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    console.log('[HEADER] Logging out...');
    logout();
    setShowUserMenu(false);
    // Use replace to avoid going back to authenticated pages
    router.replace('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-orange-600">طلاسین</div>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="جستجو در طلاسین..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pr-12 rounded-full border-2 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-orange-600 hover:bg-orange-700"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin')}
                    className="border-purple-300 hover:border-purple-600 hover:text-purple-600 text-purple-600"
                  >
                    پنل مدیر
                  </Button>
                )}
                
                {(user?.role === 'SELLER' || (user?.role === 'ADMIN' && user?.shopName)) && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="border-gray-300 hover:border-orange-600 hover:text-orange-600"
                  >
                    پنل فروشنده
                  </Button>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-50 transition-all border-2 border-transparent hover:border-orange-200"
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'} 
                        className="w-10 h-10 rounded-full ring-2 ring-orange-200 object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-200 shadow-sm">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm text-gray-900 font-semibold leading-tight">
                        {user?.name?.split(' ')[0] || 'کاربر'}
                      </span>
                      <span className="text-xs text-gray-500 leading-tight">
                        {user?.role === 'ADMIN' ? 'مدیر' : user?.role === 'SELLER' ? 'فروشنده' : 'کاربر'}
                      </span>
                    </div>
                    <ChevronDown className="hidden sm:block w-4 h-4 text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-20">
                        {/* User Info Header */}
                        <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                          <div className="flex items-center gap-3">
                            {user?.avatar ? (
                              <img 
                                src={user.avatar} 
                                alt={user.name || 'User'} 
                                className="w-14 h-14 rounded-full ring-3 ring-white shadow-md object-cover"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-3 ring-white shadow-md">
                                <User className="w-7 h-7 text-white" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-bold text-gray-900 text-right truncate">
                                {user?.name || 'کاربر'}
                              </p>
                              <p className="text-xs text-gray-600 text-right truncate mt-0.5">
                                {user?.email}
                              </p>
                              <div className="mt-1.5">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-600 text-white shadow-sm">
                                  {user?.role === 'ADMIN' ? '👑 مدیر' : user?.role === 'SELLER' ? '🏪 فروشنده' : '👤 کاربر'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {user?.role === 'ADMIN' && (
                            <button
                              onClick={() => {
                                router.push('/admin');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-right font-medium group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center transition-colors">
                                <Settings className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold">پنل مدیریت</div>
                                <div className="text-xs text-gray-500">مدیریت سایت و کاربران</div>
                              </div>
                            </button>
                          )}
                          
                          {(user?.role === 'SELLER' || (user?.role === 'ADMIN' && user?.shopName)) && (
                            <button
                              onClick={() => {
                                router.push('/dashboard');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-right font-medium group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center transition-colors">
                                <LayoutDashboard className="w-4 h-4 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold">پنل فروشنده</div>
                                <div className="text-xs text-gray-500">مدیریت محصولات فروشگاه</div>
                              </div>
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              router.push('/favorites');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-right font-medium group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                              <Heart className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">علاقه‌مندی‌ها</div>
                              <div className="text-xs text-gray-500">محصولات مورد علاقه شما</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              router.push('/orders');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-right font-medium group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                              <ShoppingBag className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">سفارشات من</div>
                              <div className="text-xs text-gray-500">پیگیری و مشاهده سفارشات</div>
                            </div>
                          </button>

                          <button
                            onClick={() => {
                              router.push('/settings');
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all text-right font-medium group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
                              <Settings className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold">تنظیمات</div>
                              <div className="text-xs text-gray-500">تنظیمات حساب کاربری</div>
                            </div>
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all text-right font-semibold rounded-lg group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <span>خروج از حساب کاربری</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className="hover:text-orange-600"
                >
                  ورود
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  فروش در طلاسین
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="جستجو در طلاسین..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pr-11 rounded-full border-2 border-gray-300 focus:border-orange-500"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-0.5 h-9 w-9 rounded-full bg-orange-600 hover:bg-orange-700"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
