'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BecomeSellerDialog } from '@/components/become-seller-dialog';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Shield, Truck, Award, Store } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isUser } = useAuth();
  const [showSellerDialog, setShowSellerDialog] = useState(false);
  // Mock featured products - TODO: Replace with actual API call
  const featuredProducts = [
    {
      id: '1',
      title: 'Elegant Gold Ring',
      type: 'RING',
      weight: 8.5,
      finalPrice: 1250,
      makingFee: 85,
      profitPercent: 12,
      seller: { shopName: "Gold Haven" },
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    },
    {
      id: '2',
      title: 'Classic Gold Necklace',
      type: 'NECKLACE',
      weight: 25.3,
      finalPrice: 2890,
      makingFee: 180,
      profitPercent: 15,
      seller: { shopName: "Royal Jewelry" },
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    },
    {
      id: '3',
      title: 'Gold Bracelet',
      type: 'BRACELET',
      weight: 15.7,
      finalPrice: 1680,
      makingFee: 120,
      profitPercent: 10,
      seller: { shopName: "Artisan Gold" },
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
    },
    {
      id: '4',
      title: 'Diamond Earrings',
      type: 'EARRING',
      weight: 6.2,
      finalPrice: 3200,
      makingFee: 250,
      profitPercent: 18,
      seller: { shopName: "Luxury Gems" },
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    },
  ];

  const categories = [
    { name: 'انگشتر', count: 234 },
    { name: 'گردنبند', count: 156 },
    { name: 'دستبند', count: 189 },
    { name: 'گوشواره', count: 278 },
    { name: 'النگو', count: 145 },
    { name: 'آویز', count: 98 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AnnouncementBar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-right">
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 font-vazirmatn leading-tight">
                  طلا یاب
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
                  هزاران طلای بازار را یک‌جا ببینید — مقایسه کنید و بهترین قیمت را پیدا کنید.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
                  <a href="/products" className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg transition-transform transform hover:-translate-y-0.5">
                    شروع خرید
                  </a>

                  {isAuthenticated && isUser && (
                    <Button
                      onClick={() => setShowSellerDialog(true)}
                      className="bg-white border border-orange-600 text-orange-600 px-6 py-3 rounded-full text-lg font-medium shadow-sm hover:shadow-md"
                    >
                      درخواست فروشندگی
                    </Button>
                  )}
                </div>

                <div className="mt-8 text-sm text-gray-500">
                  <span className="font-medium">محبوب‌ترین دسته‌ها:</span>
                  <span className="ml-2">انگشتر · گردنبند · گوشواره · دستبند</span>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                  <img src="/images/hero-gold.jpg" alt="طلای ویژه" className="w-full h-64 object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=800&fit=crop'}} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 border-b">
          <div className="container mx-auto px-4">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="flex-shrink-0 px-6 py-3 rounded-full border-2 border-gray-200 hover:border-orange-600 hover:text-orange-600 transition-colors"
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="ml-2 text-sm text-gray-500">({category.count})</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-right">محصولات ویژه</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <a href={`/products/${product.id}`} key={product.id}>
                  <Card className="group cursor-pointer overflow-hidden border-gray-200 hover:shadow-lg transition-all">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
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
                          فروشنده: {product.seller.shopName}
                        </p>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Sparkles className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">کیفیت تضمین شده</h3>
                <p className="text-sm text-gray-600">طلای ۱۰۰٪ اصل</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">پرداخت امن</h3>
                <p className="text-sm text-gray-600">ایمن و رمزگذاری شده</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Truck className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">ارسال سریع</h3>
                <p className="text-sm text-gray-600">ارسال رایگان بالای ۵۰۰ هزار تومان</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">فروشندگان معتبر</h3>
                <p className="text-sm text-gray-600">فقط فروشندگان تایید شده</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t">
          <div className="container mx-auto px-4 text-center text-sm text-gray-600">
            <p>ایمیل: Talagoldseen@gmail.com</p>
            <p className="mt-2">تمامی حقوق محفوظ است</p>
          </div>
        </footer>
      </main>

      {/* Become Seller Dialog */}
      <BecomeSellerDialog 
        isOpen={showSellerDialog} 
        onClose={() => setShowSellerDialog(false)} 
      />
    </div>
  );
}
