import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

// Mock data - will be replaced with API calls
const featuredProducts = [
  {
    id: '1',
    title: 'گردنبند طلا با آویز قلب',
    price: 25000000,
    images: ['/api/placeholder/400/400'],
    goldPurity: '18',
    vendor: { shopName: 'طلای نگین' }
  },
  {
    id: '2',
    title: 'حلقه ازدواج کلاسیک',
    price: 18000000,
    images: ['/api/placeholder/400/400'],
    goldPurity: '18',
    vendor: { shopName: 'زرگری امید' }
  },
  {
    id: '3',
    title: 'دستبند النگویی طرح دار',
    price: 32000000,
    images: ['/api/placeholder/400/400'],
    goldPurity: '21',
    vendor: { shopName: 'طلا و جواهر آرمان' }
  },
  {
    id: '4',
    title: 'گوشواره حلقه‌ای بزرگ',
    price: 22000000,
    images: ['/api/placeholder/400/400'],
    goldPurity: '18',
    vendor: { shopName: 'جواهرسازی پارسیان' }
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section - Etsy inspired */}
      <section className="bg-gradient-to-r from-gold-50 to-gold-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              بازار طلای تلاسین
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              کشف محصولات منحصر به فرد از بهترین زرگران ایران
            </p>
            <Link href="/products" className="btn-primary inline-block">
              مشاهده همه محصولات
            </Link>
          </div>
        </div>
      </section>

      {/* Categories - Etsy style */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">خرید بر اساس دسته‌بندی</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['گردنبند', 'حلقه', 'دستبند', 'گوشواره', 'النگو', 'آویز'].map((category) => (
              <Link 
                key={category}
                href={`/products?category=${category}`}
                className="text-center group"
              >
                <div className="aspect-square bg-gray-100 rounded-full mb-3 overflow-hidden group-hover:shadow-lg transition-shadow">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-200 to-gold-400">
                    <span className="text-4xl">💍</span>
                  </div>
                </div>
                <p className="font-medium group-hover:text-gold-600">{category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">محصولات ویژه</h2>
            <Link href="/products" className="text-sm hover:text-gold-600">
              مشاهده همه ←
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Etsy inspired */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-12 text-center">چرا تلاسین؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-bold mb-2">کیفیت تضمین شده</h3>
              <p className="text-gray-600">همه محصولات با گواهی اصالت و عیار</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="font-bold mb-2">خرید امن</h3>
              <p className="text-gray-600">پرداخت امن و ضمانت بازگشت وجه</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-bold mb-2">ارسال سریع</h3>
              <p className="text-gray-600">ارسال به سراسر کشور با بیمه کامل</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">تلاسین</h3>
              <p className="text-gray-400 text-sm">
                بزرگترین بازار آنلاین طلا و جواهرات ایران
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">خرید</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products">همه محصولات</Link></li>
                <li><Link href="/vendors">فروشندگان</Link></li>
                <li><Link href="/products?featured=true">محصولات ویژه</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">فروش</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/vendor/register">ثبت نام فروشنده</Link></li>
                <li><Link href="/vendor/login">ورود فروشنده</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">پشتیبانی</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">درباره ما</Link></li>
                <li><Link href="/contact">تماس با ما</Link></li>
                <li><Link href="/terms">قوانین و مقررات</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 تلاسین. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
