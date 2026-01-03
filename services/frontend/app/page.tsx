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
        {/* Premium Hero Section - Elegant Dark Luxury Theme */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 md:py-32">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0">
            {/* Gold & Burgundy Glow Elements */}
            <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-amber-600 to-rose-600 rounded-full blur-3xl opacity-15 animate-pulse"></div>
            <div className="absolute bottom-0 right-20 w-96 h-96 bg-gradient-to-tl from-amber-500 to-yellow-600 rounded-full blur-3xl opacity-10"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-amber-400/40 mb-6 backdrop-blur-sm hover:bg-white/10 transition-all">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span className="text-amber-200 text-sm font-medium">✨ بازار لوکس طلا و جواهر ✨</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-vazirmatn leading-tight">
                <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent block mb-2 drop-shadow-lg">طلاسین</span>
                <span className="text-slate-100 text-3xl md:text-4xl font-normal drop-shadow-lg">
                  بازار هوشمند طلا و جواهر
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                هزاران طلای بازار را یک‌جا مقایسه کنید
                <br />
                <span className="text-amber-300 font-bold">🏆 بهترین قیمت را پیدا کنید 🏆</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated && isUser && (
                  <Button
                    onClick={() => setShowSellerDialog(true)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 px-8 py-4 rounded-full text-lg font-bold shadow-2xl shadow-amber-500/40 transition-premium hover:scale-105 border-2 border-amber-300"
                  >
                    <Store className="w-5 h-5 ml-2" />
                    درخواست فروشندگی
                  </Button>
                )}
                <Button
                  onClick={() => window.location.href = '/products'}
                  variant="outline"
                  className="bg-transparent hover:bg-white/5 text-slate-100 border-2 border-slate-400/50 hover:border-amber-400 px-8 py-4 rounded-full text-lg font-semibold transition-premium"
                >
                  مشاهده محصولات
                </Button>
                <Button
                  onClick={() => window.location.href = '/blog'}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg shadow-amber-600/40 border-amber-500"
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

        {/* Statistics Section - Impact Numbers */}
        <section className="py-20 bg-charcoal-gradient relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-3">طلاسین در اعداد</h2>
              <p className="text-amber-200">ارقام موفقیت ما در بازار</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center text-white">
                <div className="text-5xl font-extrabold text-gold-gradient mb-2">۱۰۰+</div>
                <p className="text-amber-200 font-semibold">فروشنده معتبر</p>
              </div>
              <div className="text-center text-white">
                <div className="text-5xl font-extrabold text-gold-gradient mb-2">۵۰۰۰+</div>
                <p className="text-amber-200 font-semibold">محصول برتر</p>
              </div>
              <div className="text-center text-white">
                <div className="text-5xl font-extrabold text-gold-gradient mb-2">۲۴/۷</div>
                <p className="text-amber-200 font-semibold">پشتیبانی دوازده‌ساعته</p>
              </div>
              <div className="text-center text-white">
                <div className="text-5xl font-extrabold text-gold-gradient mb-2">۹۹٪</div>
                <p className="text-amber-200 font-semibold">رضایت مشتریان</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Process Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">چگونه کار می‌کند؟</h2>
              <p className="text-gray-600 text-lg">۴ مرحله ساده برای خرید طلای بهترین</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="relative text-center">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  ۱
                </div>
                <div className="pt-12 px-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">جستجو و مقایسه</h3>
                  <p className="text-gray-600 leading-relaxed">بازار را جستجو کنید و قیمت‌ها را با هزاران محصول مقایسه کنید</p>
                </div>
              </div>

              <div className="relative text-center">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  ۲
                </div>
                <div className="pt-12 px-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">انتخاب محصول</h3>
                  <p className="text-gray-600 leading-relaxed">بهترین گزینه‌ را انتخاب کنید و از فروشنده معتبر بخرید</p>
                </div>
              </div>

              <div className="relative text-center">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  ۳
                </div>
                <div className="pt-12 px-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">پرداخت امن</h3>
                  <p className="text-gray-600 leading-relaxed">درگاه پرداخت ایمن و رمزگذاری شده استفاده کنید</p>
                </div>
              </div>

              <div className="relative text-center">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  ۴
                </div>
                <div className="pt-12 px-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">دریافت محصول</h3>
                  <p className="text-gray-600 leading-relaxed">محصول را به آدرسی که انتخاب کردید دریافت کنید</p>
                </div>
              </div>
            </div>

            {/* Connection lines */}
            <div className="hidden md:flex justify-between px-8 absolute w-full top-32" style={{pointerEvents: 'none'}}>
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 mx-2"></div>
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 mx-2"></div>
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-6 mx-2"></div>
            </div>
          </div>
        </section>

        {/* Features Section - Detailed Benefits */}
        <section className="py-20 bg-gradient-to-b from-amber-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">ویژگی‌های منحصر به فرد</h2>
              <p className="text-gray-600 text-lg">تجربه خریدی که دیگری ندارد</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">جستجوی هوشمند</h3>
                  <p className="text-gray-600 leading-relaxed">فیلترهای پیشرفته برای یافتن دقیق طلای مورد نظرتان</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">بهترین قیمت</h3>
                  <p className="text-gray-600 leading-relaxed">مقایسه قیمت‌ها و پیدا کردن بهترین معامله</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">تایید اصالت</h3>
                  <p className="text-gray-600 leading-relaxed">تمام محصولات با گواهی اصالت تایید شده‌اند</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ارسال رایگان</h3>
                  <p className="text-gray-600 leading-relaxed">ارسال سریع و رایگان برای خریدهای بالای ۵۰۰ هزار تومان</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">پشتیبانی ۲۴/۷</h3>
                  <p className="text-gray-600 leading-relaxed">تیم پشتیبانی ما همیشه برای کمک حاضر است</p>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-2xl bg-white border-2 border-amber-100 hover:border-amber-400 hover:shadow-lg transition-all group">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">فروشندگان برتر</h3>
                  <p className="text-gray-600 leading-relaxed">همکاری با بهترین و معتبرترین فروشندگان</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Call to Action */}
        <section className="py-20 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              آماده‌اید طلای خود را پیدا کنید؟
            </h2>
            <p className="text-xl text-amber-50 mb-10 max-w-2xl mx-auto leading-relaxed">
              میلیون‌ها گزینه، هزاران فروشنده معتبر، و قیمت‌های بهترین همه در یک جا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/products'}
                className="bg-white hover:bg-gray-100 text-amber-700 px-8 py-4 rounded-full text-lg font-bold shadow-2xl transition-all hover:scale-105"
              >
                شروع جستجو
              </Button>
              <Button
                onClick={() => window.location.href = '/blog'}
                variant="outline"
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white/50 hover:border-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
              >
                خواندن راهنماها
              </Button>
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
