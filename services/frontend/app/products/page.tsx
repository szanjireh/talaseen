'use client';

import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/like-button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  likesCount?: number;
  isLiked?: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.products.getAll({ page: String(page), limit: '12' }));
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
    <div className="min-h-screen bg-white">
      <Header />
      <AnnouncementBar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-right">
          <h1 className="text-3xl font-bold text-gray-900">
            تمام محصولات
          </h1>
          <p className="text-gray-600 mt-2">
            {loading ? 'در حال بارگذاری...' : `${products.length} محصول در این صفحه`}
          </p>
        </div>

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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const primaryImage = product.images?.find(img => img.isPrimary);
                const imageUrl = primaryImage?.url || product.images?.[0]?.url;
                
                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-gray-200 hover:shadow-lg transition-all">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={imageUrl ? getImageUrl(imageUrl) : 'https://placehold.co/400x400?text=No+Image'}
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
                            <span className="font-medium" suppressHydrationWarning>
                              {product.makingFee.toLocaleString('fa-IR')}%
                            </span>
                            <span className="text-gray-600">:اجرت</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-green-600" suppressHydrationWarning>
                              {product.profitPercent.toLocaleString('fa-IR')}%
                            </span>
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

                        {/* Like Button */}
                        <div className="pt-2 border-t" onClick={(e) => e.preventDefault()}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                >
                  قبلی
                </Button>
                <span className="px-4 py-2 text-gray-700">
                  صفحه {page.toLocaleString('fa-IR')} از {totalPages.toLocaleString('fa-IR')}
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                >
                  بعدی
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
