'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LikeButton } from '@/components/like-button';
import { ProtectedRoute } from '@/components/protected-route';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Heart, Home } from 'lucide-react';

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

function FavoritesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLikedProducts();
    } else {
      setLoading(false);
    }
  }, [page, token, isAuthenticated]);

  const fetchLikedProducts = async () => {
    if (!token) {
      console.log('No token available for fetching liked products');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching liked products with token:', token ? 'token exists' : 'no token');
      const url = api.products.getMyLiked({ page: String(page), limit: '12' });
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Received data:', data);
        const likedProducts = Array.isArray(data) ? data : data?.products || [];
        console.log('Liked products count:', likedProducts.length);
        setProducts(likedProducts);
        setTotalPages(data?.pagination?.pages || 1);
      } else {
        console.error('Failed to fetch liked products, status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch liked products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-right bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold">علاقه‌مندی‌های من</h1>
        </div>
        <p className="text-lg text-gray-600 mt-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
              در حال بارگذاری...
            </span>
          ) : (
            <span className="text-red-600 font-semibold">{products.length} محصول در این صفحه</span>
          )}
        </p>
      </div>

      <div>
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
          <Card className="p-16 text-center bg-white shadow-xl border-2 border-red-100">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">محصولی دوست داشته نشده</h3>
              <p className="text-gray-600 mb-6">
                هنوز محصولی را به علاقه‌مندی‌های خود اضافه نکرده‌اید
              </p>
              <Button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-bold shadow-lg"
              >
                <Home className="w-4 h-4 ml-2" />
                مرور محصولات
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const primaryImage = product.images?.find((img) => img.isPrimary);
                const imageUrl = primaryImage?.url || product.images?.[0]?.url;

                return (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="group cursor-pointer overflow-hidden border-2 border-amber-100 hover:border-amber-400 bg-white premium-card-hover shadow-md hover:shadow-2xl">
                      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                        <img
                          src={
                            imageUrl
                              ? getImageUrl(imageUrl)
                              : 'https://placehold.co/400x400?text=No+Image'
                          }
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Like Button Overlay */}
                        <div
                          className="absolute top-3 left-3 z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <LikeButton
                            productId={product.id}
                            initialLikesCount={product.likesCount || 0}
                            initialIsLiked={true}
                            size="md"
                            onLikeChange={() => {
                              // Refresh the list when a product is unliked
                              fetchLikedProducts();
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-1 text-right">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-500 text-right line-clamp-1">
                            {product.description}
                          </p>
                        </div>

                        {/* Seller Info */}
                        <div className="text-xs text-gray-600 text-right">
                          {product.seller?.shopName}
                        </div>

                        {/* Price */}
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-500">تومان</span>
                          <span className="font-bold text-amber-700">
                            {product.finalPrice.toLocaleString('fa-IR')}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex justify-between gap-2 text-xs text-gray-600 pt-2 border-t border-gray-200">
                          <div className="text-center flex-1">
                            <div className="font-semibold text-gray-900">{product.weight}g</div>
                            <div>وزن</div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="font-semibold text-gray-900">{product.makingFee}%</div>
                            <div>اجرت</div>
                          </div>
                          <div className="text-center flex-1">
                            <div className="font-semibold text-gray-900">
                              {product.profitPercent}%
                            </div>
                            <div>سود</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="rounded-lg"
                >
                  صفحه قبلی
                </Button>

                <div className="flex gap-2">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? 'default' : 'outline'}
                        className="rounded-lg w-10 h-10 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  className="rounded-lg"
                >
                  صفحه بعدی
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute allowedRoles={['USER', 'SELLER', 'ADMIN']}>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <FavoritesContent />
      </Suspense>
    </ProtectedRoute>
  );
}
