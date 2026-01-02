'use client';

import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { SearchFilters, FilterState } from '@/components/search-filters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/like-button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { Shield, Search } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description?: string;
  type: string;
  weight: number;
  makingFee: number;
  profitPercent: number;
  finalPrice: number;
  seller?: {
    shopName: string;
  };
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  likesCount?: number;
  isLiked?: boolean;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minWeight: searchParams.get('minWeight') || '',
    maxWeight: searchParams.get('maxWeight') || '',
    maxProfitPercent: searchParams.get('maxProfitPercent') || '',
    maxMakingFee: searchParams.get('maxMakingFee') || '',
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(searchParams.entries());
      const response = await fetch(api.products.search(query, params));
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    
    // Build URL params
    const params = new URLSearchParams({ q: query });
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white">
      <Header />
      <AnnouncementBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header - Premium */}
        <div className="mb-8 text-right bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-amber-600">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                  <span>در حال جستجو...</span>
                </div>
              ) : (
                <span>{products.length} محصول پیدا شد</span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                نتایج جستجو برای "<span className="text-gold-gradient">{query}</span>"
              </h1>
              <p className="text-gray-600">مقایسه و انتخاب بهترین قیمت</p>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar - Premium */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28">
              <SearchFilters
                activeFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Products Grid - Premium */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-md">
                    <div className="aspect-square skeleton-gold"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 skeleton-gold rounded"></div>
                      <div className="h-4 skeleton-gold rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="p-16 text-center bg-white shadow-xl border-2 border-amber-100">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
                  <p className="text-gray-600 mb-6">متأسفانه محصولی با این مشخصات پیدا نکردیم</p>
                  <Button
                    onClick={() => router.push('/')}
                    className="bg-gold-gradient hover:opacity-90 text-gray-900 font-bold shadow-lg"
                  >
                    بازگشت به صفحه اصلی
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-2 border-amber-100 hover:border-amber-400 bg-white premium-card-hover shadow-md hover:shadow-2xl">
                      {/* Product Image with Premium Overlay */}
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                        <img
                          src={product.images?.[0]?.url ? getImageUrl(product.images[0].url) : 'https://placehold.co/400x400?text=No+Image'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                          {product.type}
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] text-right text-lg group-hover:text-amber-700 transition-colors">
                          {product.title}
                        </h3>
                        
                        <div className="space-y-2 text-sm bg-amber-50/50 rounded-xl p-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">{product.weight} گرم</span>
                            <span className="text-gray-600 text-xs">وزن طلا</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-amber-700" suppressHydrationWarning>{product.makingFee.toLocaleString('fa-IR')}%</span>
                            <span className="text-gray-600 text-xs">اجرت ساخت</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-green-600" suppressHydrationWarning>{product.profitPercent.toLocaleString('fa-IR')}%</span>
                            <span className="text-gray-600 text-xs">سود فروشنده</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t-2 border-amber-200">
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-extrabold text-gold-gradient" suppressHydrationWarning>
                              {product.finalPrice.toLocaleString('fa-IR')}
                            </p>
                            <span className="text-gray-600 text-sm">تومان</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-gray-500">فروشنده تایید شده</span>
                          </div>
                          <p className="text-xs text-gray-700 font-medium">
                            {product.seller?.shopName || 'نامشخص'}
                          </p>
                        </div>

                        <div className="pt-2" onClick={(e) => e.preventDefault()}>
                          <LikeButton 
                            productId={product.id}
                            initialLikesCount={product.likesCount}
                            initialIsLiked={product.isLiked}
                            size="sm"
                          />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Header />
        <AnnouncementBar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
