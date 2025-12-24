'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Search, LogOut, User, Settings } from 'lucide-react';
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
                {user?.role === 'SELLER' || user?.role === 'ADMIN' ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
                    className="border-gray-300 hover:border-orange-600 hover:text-orange-600"
                  >
                    {user.role === 'ADMIN' ? 'پنل مدیر' : 'پنل فروشنده'}
                  </Button>
                ) : null}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                    )}
                    <span className="hidden sm:inline text-sm text-gray-700 font-medium">
                      {user?.name?.split(' ')[0] || 'کاربر'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 text-right">
                            {user?.name || 'کاربر'}
                          </p>
                          <p className="text-xs text-gray-500 text-right mt-1">
                            {user?.email}
                          </p>
                          <p className="text-xs text-orange-600 font-medium mt-1 text-right">
                            {user?.role === 'ADMIN' ? 'مدیر' : user?.role === 'SELLER' ? 'فروشنده' : 'کاربر'}
                          </p>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-right"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>خروج</span>
                        </button>
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
