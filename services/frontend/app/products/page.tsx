'use client';

import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/like-button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { Shield } from 'lucide-react';

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

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Get type filter from URL
  const typeFilter = searchParams.get('type');

  // Category name mapping
  const categoryNames: Record<string, string> = {
    RING: 'انگشتر',
    NECKLACE: 'گردنبند',
    BRACELET: 'دستبند',
    EARRING: 'گوشواره',
    BANGLE: 'النگو',
    PENDANT: 'آویز',
    ANKLET: 'پابند',
    CHAIN: 'زنجیر',
    COIN: 'سکه',
    BAR: 'شمش',
    OTHER: 'سایر',
  };

  useEffect(() => {
    fetchProducts();
  }, [page, typeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = { page: String(page), limit: '12' };
      if (typeFilter) {
        params.type = typeFilter;
      }
      const response = await fetch(api.products.getAll(params));
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/20 to-white">
      <Header />
      <AnnouncementBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-right bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
          <h1 className="text-4xl font-bold mb-2">
            {typeFilter ? (
              <span><span className="text-gold-gradient">{categoryNames[typeFilter] || typeFilter}</span></span>
            ) : (
              <span className="text-gray-900">تمام محصولات</span>
            )}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-600"></div>
                در حال بارگذاری...
              </span>
            ) : (
              <span className="text-amber-600 font-semibold">{products.length} محصول در این صفحه</span>
            )}
          </p>
          {typeFilter && (
            <Button
              onClick={() => router.push('/products')}
              variant="outline"
              className="mt-4 border-2 border-amber-300 hover:border-amber-600 hover:bg-amber-50 font-semibold"
            >
              نمایش همه محصولات
            </Button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
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
                <Shield className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-600 mb-6">در این دسته‌بندی محصولی موجود نیست</p>
              <Button
                onClick={() => router.push('/')}
                className="bg-gold-gradient hover:opacity-90 text-gray-900 font-bold shadow-lg"
              >
                بازگشت به صفحه اصلی
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary);
                const imageUrl = primaryImage?.url || product.images?.[0]?.url;
                
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-2 border-amber-100 hover:border-amber-400 bg-white premium-card-hover shadow-md hover:shadow-2xl">
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                        <img
                          src={imageUrl ? getImageUrl(imageUrl) : 'https://placehold.co/400x400?text=No+Image'}
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
                            <span className="font-semibold text-amber-700" suppressHydrationWarning>
                              {product.makingFee.toLocaleString('fa-IR')}%
                            </span>
                            <span className="text-gray-600 text-xs">اجرت ساخت</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-green-600" suppressHydrationWarning>
                              {product.profitPercent.toLocaleString('fa-IR')}%
                            </span>
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
                );
              })}
            </div>

            {/* Pagination - Premium */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-3 bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-100">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="bg-gold-gradient hover:opacity-90 text-gray-900 font-bold disabled:opacity-40"
                >
                  → قبلی
                </Button>
                <div className="px-6 py-2 bg-amber-50 rounded-xl">
                  <span className="text-gray-900 font-bold">
                    صفحه <span className="text-amber-600">{page.toLocaleString('fa-IR')}</span> از {totalPages.toLocaleString('fa-IR')}
                  </span>
                </div>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="bg-gold-gradient hover:opacity-90 text-gray-900 font-bold disabled:opacity-40"
                >
                  بعدی ←
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
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
      <ProductsContent />
    </Suspense>
  );
}
