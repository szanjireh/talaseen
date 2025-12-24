'use client';

import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { SearchFilters, FilterState } from '@/components/search-filters';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

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
    <div className="min-h-screen bg-white">
      <Header />
      <AnnouncementBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-right">
          <h1 className="text-2xl font-bold text-gray-900">
            نتایج جستجو برای "{query}"
          </h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'در حال جستجو...' : `${products.length} مورد یافت شد`}
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <SearchFilters
                activeFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-600 mb-4">هیچ محصولی یافت نشد</p>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                >
                  بازگشت به صفحه اصلی
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-gray-200 hover:shadow-lg transition-all">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0]?.url ? getImageUrl(product.images[0].url) : 'https://placehold.co/400x400?text=No+Image'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] text-right">
                          {product.title}
                        </h3>
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{product.weight} گرم</span>
                            <span className="text-gray-600">:وزن</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium" suppressHydrationWarning>{product.makingFee.toLocaleString('fa-IR')} تومان</span>
                            <span className="text-gray-600">:اجرت</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-green-600" suppressHydrationWarning>{product.profitPercent.toLocaleString('fa-IR')}%</span>
                            <span className="text-gray-600">:سود</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xl font-bold text-orange-600 text-right" suppressHydrationWarning>
                            {product.finalPrice.toLocaleString('fa-IR')} تومان
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {product.type}
                          </span>
                          <p className="text-xs text-gray-500">
                            فروشنده: {product.seller?.shopName || 'نامشخص'}
                          </p>
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
