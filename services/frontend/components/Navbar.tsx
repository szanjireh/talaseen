import Link from 'next/link';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top banner */}
      <div className="bg-black text-white text-center py-2 text-sm">
        <p>خوش آمدید به بزرگترین بازار طلای ایران - ارسال رایگان برای سفارش‌های بالای 10 میلیون تومان</p>
      </div>
      
      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gold-600">تلاسین</h1>
          </Link>

          {/* Search bar - Etsy style */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجوی طلا، حلقه، گردنبند، دستبند و ..."
                className="w-full px-4 py-2 pr-10 border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right menu */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="flex items-center gap-1 hover:text-gold-600">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">ورود</span>
            </Link>
            
            <Link href="/favorites" className="hover:text-gold-600">
              <Heart className="h-5 w-5" />
            </Link>
            
            <Link href="/cart" className="flex items-center gap-1 hover:text-gold-600">
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden md:inline">سبد خرید</span>
            </Link>
          </div>
        </div>

        {/* Category menu - Etsy style */}
        <div className="flex items-center gap-8 py-3 text-sm border-t border-gray-100">
          <Link href="/products?category=necklace" className="hover:text-gold-600">گردنبند</Link>
          <Link href="/products?category=ring" className="hover:text-gold-600">حلقه</Link>
          <Link href="/products?category=bracelet" className="hover:text-gold-600">دستبند</Link>
          <Link href="/products?category=earring" className="hover:text-gold-600">گوشواره</Link>
          <Link href="/products?category=bangle" className="hover:text-gold-600">النگو</Link>
          <Link href="/vendors" className="hover:text-gold-600">فروشندگان</Link>
        </div>
      </div>
    </nav>
  );
}
