'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
            <div className="text-2xl font-bold text-orange-600">تلاسین</div>
          </Link>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl mx-8"
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for gold jewelry..."
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
                <span className="hidden sm:inline text-sm text-gray-700">
                  Hi, {user?.name?.split(' ')[0] || 'User'}
                </span>
                {user?.role === 'SELLER' || user?.role === 'ADMIN' ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')}
                    className="border-gray-300 hover:border-orange-600 hover:text-orange-600"
                  >
                    {user.role === 'ADMIN' ? 'Admin Panel' : 'Seller Panel'}
                  </Button>
                ) : null}
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  className="hover:text-orange-600"
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Sell on Talaseen
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
                placeholder="Search for gold jewelry..."
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
