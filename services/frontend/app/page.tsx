'use client';

import { useState, useEffect } from 'react';
// Header and AnnouncementBar are now rendered globally in layout
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BecomeSellerDialog } from '@/components/become-seller-dialog';
import { LikeButton } from '@/components/like-button';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Shield, Truck, Award, Store } from 'lucide-react';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

export default function Home() {
  const { isAuthenticated, isUser } = useAuth();
  const [showSellerDialog, setShowSellerDialog] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch featured products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(api.products.getAll({ limit: '8' }));
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch category counts from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch(`${api.baseURL}/products/categories/counts`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <main>
        {/* Premium Hero Section - Gold Luxury Theme */}
        <section className="relative overflow-hidden bg-charcoal-gradient py-24 md:py-32">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold-gradient rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-gradient rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">بازار لوکس طلا و جواهر</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-vazirmatn leading-tight">
                <span className="text-gold-gradient block mb-2">طلاسین</span>
                <span className="text-white text-3xl md:text-4xl font-normal">
                  بازار هوشمند طلا
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-amber-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                هزاران طلای بازار را یک‌جا مقایسه کنید
                <br />
                <span className="text-amber-300 font-semibold">بهترین قیمت را پیدا کنید</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated && isUser && (
                  <Button
                    onClick={() => setShowSellerDialog(true)}
                    className="bg-gold-gradient hover:opacity-90 text-gray-900 px-8 py-4 rounded-full text-lg font-bold shadow-2xl shadow-amber-500/50 transition-premium hover:scale-105 border-2 border-amber-400"
                  >
                    <Store className="w-5 h-5 ml-2" />
                    درخواست فروشندگی
                  </Button>
                )}
                <Button
                  onClick={() => window.location.href = '/products'}
                  variant="outline"
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 hover:border-amber-400 px-8 py-4 rounded-full text-lg font-semibold transition-premium"
                >
                  مشاهده محصولات
                </Button>
                <Button
                  onClick={() => window.location.href = '/blog'}
                  className="bg-amber-500 hover:opacity-95 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md border-amber-400"
                >
                  مطالعه بلاگ
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave Decoration */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white" fillOpacity="1"/>
            </svg>
          </div>
        </section>

        {/* Categories - Premium Design */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">دسته‌بندی محصولات</h2>
              <p className="text-gray-600">انتخاب از میان دسته‌های مختلف طلا و جواهر</p>
            </div>
            
            {categoriesLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 justify-center">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-40 h-20 skeleton-gold rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 px-4 justify-center">
                {categories.map((category) => (
                  <a
                    key={category.type}
                    href={`/products?type=${category.type}`}
                    className="group flex-shrink-0 px-6 py-4 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-white hover:bg-amber-50 transition-premium hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="text-center">
                      <span className="font-bold text-gray-900 text-lg group-hover:text-amber-700 transition-colors">{category.name}</span>
                      <div className="mt-1 text-sm text-amber-600 font-medium">({category.count})</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Latest Products - Premium Grid */}
        <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <a 
                href="/products" 
                className="group flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold text-lg transition-colors"
              >
                <span>مشاهده همه</span>
                <span className="group-hover:translate-x-1 transition-transform">←</span>
              </a>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-gray-900">جدیدترین محصولات</h2>
                <p className="text-gray-600 mt-2">تازه‌ترین طلاها از فروشندگان معتبر</p>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="aspect-square skeleton-gold"></div>
                    <div className="p-4 space-y-3 bg-white">
                      <div className="h-4 skeleton-gold rounded"></div>
                      <div className="h-4 skeleton-gold rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <Card className="p-12 text-center bg-white shadow-lg">
                <p className="text-gray-600 text-lg">هیچ محصولی یافت نشد</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const primaryImage = product.images?.find((img: any) => img.isPrimary);
                  const imageUrl = primaryImage?.url || product.images?.[0]?.url;
                  
                  return (
                    <a href={`/products/${product.id}`} key={product.id}>
                      <Card className="group cursor-pointer overflow-hidden border-2 border-amber-100 hover:border-amber-400 bg-white premium-card-hover shadow-md hover:shadow-2xl">
                        {/* Product Image with Premium Overlay */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-white">
                          <img
                            src={imageUrl ? getImageUrl(imageUrl) : 'https://placehold.co/400x400?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Gold Overlay on Hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Premium Badge */}
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                            {product.type}
                          </div>
                        </div>
                        
                        <div className="p-5 space-y-3">
                          <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] text-right text-lg group-hover:text-amber-700 transition-colors">
                            {product.title}
                          </h3>
                          
                          {/* Product Details with Icons */}
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

                          {/* Price - Premium Display */}
                          <div className="pt-3 border-t-2 border-amber-200">
                            <div className="flex items-center justify-between">
                              <p className="text-2xl font-extrabold text-gold-gradient" suppressHydrationWarning>
                                {product.finalPrice.toLocaleString('fa-IR')}
                              </p>
                              <span className="text-gray-600 text-sm">تومان</span>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-gray-500">فروشنده تایید شده</span>
                            </div>
                            <p className="text-xs text-gray-700 font-medium">
                              {product.seller?.shopName || 'نامشخص'}
                            </p>
                          </div>

                          {/* Like Button */}
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
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Trust Badges - Premium Design */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">چرا طلاسین؟</h2>
              <p className="text-gray-600">اعتماد و امنیت در هر خرید</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 mb-6 shadow-xl shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-10 h-10 text-white" />
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-amber-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">کیفیت تضمین شده</h3>
                <p className="text-sm text-gray-600 leading-relaxed">طلای ۱۰۰٪ اصل با گواهی اصالت</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 mb-6 shadow-xl shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-green-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">پرداخت امن</h3>
                <p className="text-sm text-gray-600 leading-relaxed">پرداخت رمزگذاری شده و ایمن</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 mb-6 shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-blue-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">ارسال سریع</h3>
                <p className="text-sm text-gray-600 leading-relaxed">ارسال رایگان بالای ۵۰۰ هزار تومان</p>
              </div>
              
              <div className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 mb-6 shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-10 h-10 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-purple-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">فروشندگان معتبر</h3>
                <p className="text-sm text-gray-600 leading-relaxed">فقط فروشندگان تایید شده</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Become Seller Dialog */}
      <BecomeSellerDialog 
        isOpen={showSellerDialog} 
        onClose={() => setShowSellerDialog(false)} 
      />
    </div>
  );
}
