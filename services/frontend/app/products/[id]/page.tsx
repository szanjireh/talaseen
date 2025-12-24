'use client';

import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ArrowLeft, Weight, DollarSign, TrendingUp, Package } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  type: string;
  weight: number;
  size: number | null;
  makingFee: number;
  profitPercent: number;
  goldPriceAtCreation: number;
  finalPrice: number;
  images: ProductImage[];
  seller: {
    id: string;
    shopName: string;
    user: {
      name: string;
      avatar: string | null;
    };
  };
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.products.getById(productId));
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
        const primaryImg = data.images.find((img: ProductImage) => img.isPrimary);
        setSelectedImage(primaryImg?.url || data.images[0]?.url || '');
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <AnnouncementBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری محصول...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <AnnouncementBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">محصول یافت نشد</h1>
          <Button onClick={() => router.push('/')}>بازگشت به صفحه اصلی</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <AnnouncementBar />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:text-orange-600"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          بازگشت
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(selectedImage)}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image.url
                        ? 'border-orange-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-orange-600" suppressHydrationWarning>
                  {product.finalPrice.toLocaleString('fa-IR')} تومان
                </p>
                <span className="text-sm text-gray-500">قیمت نهایی</span>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="p-4 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">فروشنده</p>
                  <p className="font-semibold text-gray-900">{product.seller.shopName}</p>
                </div>
              </div>
            </Card>

            {/* Product Specifications */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-right">جزئیات محصول</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-semibold">{product.weight} گرم</span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>وزن</span>
                    <Weight className="w-4 h-4" />
                  </div>
                </div>
                
                {product.size && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="font-semibold">{product.size}</span>
                    <span className="text-gray-600">سایز</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-semibold">{product.type}</span>
                  <span className="text-gray-600">نوع</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-semibold" suppressHydrationWarning>{product.makingFee.toLocaleString('fa-IR')} تومان</span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>اجرت ساخت</span>
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="font-semibold text-green-600" suppressHydrationWarning>{product.profitPercent.toLocaleString('fa-IR')}%</span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>حاشیه سود</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="font-semibold" suppressHydrationWarning>{product.goldPriceAtCreation.toLocaleString('fa-IR')} تومان/گرم</span>
                  <span className="text-gray-600">قیمت طلا (هنگام ثبت)</span>
                </div>
              </div>
            </Card>

            {/* Description */}
            {product.description && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-3 text-right">توضیحات</h3>
                <p className="text-gray-700 whitespace-pre-line text-right">{product.description}</p>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-6">
                تماس با فروشنده
              </Button>
              <Button variant="outline" className="flex-1 text-lg py-6">
                افزودن به علاقه‌مندی‌ها
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-900 text-right">
                <strong>توجه:</strong> قیمت نهایی شامل هزینه طلا، اجرت ساخت و حاشیه سود می‌باشد. قیمت‌ها بر اساس نرخ فعلی بازار طلا ممکن است متغیر باشد.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
