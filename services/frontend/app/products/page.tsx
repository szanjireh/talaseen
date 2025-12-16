'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProductCard from '../../components/ProductCard';
import { ChevronDown } from 'lucide-react';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPurity, setSelectedPurity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Mock products
  const products = Array(12).fill(null).map((_, i) => ({
    id: `${i + 1}`,
    title: `محصول طلای شماره ${i + 1}`,
    price: (15000000 + i * 2000000),
    images: ['/api/placeholder/400/400'],
    goldPurity: ['18', '21', '22'][i % 3],
    vendor: { shopName: `فروشگاه ${i + 1}` }
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span>خانه</span> / <span className="text-gray-900">همه محصولات</span>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar - Etsy style */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="font-bold mb-4">فیلترها</h3>
              
              {/* Category filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  دسته‌بندی
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {['همه', 'گردنبند', 'حلقه', 'دستبند', 'گوشواره', 'النگو'].map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="category" 
                        className="accent-black"
                        onChange={() => setSelectedCategory(cat)}
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gold purity filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  عیار طلا
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {['همه', '18 عیار', '21 عیار', '22 عیار', '24 عیار'].map((purity) => (
                    <label key={purity} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="purity" 
                        className="accent-black"
                        onChange={() => setSelectedPurity(purity)}
                      />
                      <span className="text-sm">{purity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center justify-between">
                  محدوده قیمت
                  <ChevronDown className="h-4 w-4" />
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'همه', value: 'all' },
                    { label: 'زیر 20 میلیون', value: '0-20' },
                    { label: '20 تا 40 میلیون', value: '20-40' },
                    { label: '40 تا 60 میلیون', value: '40-60' },
                    { label: 'بالای 60 میلیون', value: '60-' },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="price" 
                        className="accent-black"
                        onChange={() => setPriceRange(range.value)}
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort and filter bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                {products.length} محصول یافت شد
              </p>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                <option>مرتب‌سازی: جدیدترین</option>
                <option>قیمت: کمترین به بیشترین</option>
                <option>قیمت: بیشترین به کمترین</option>
                <option>محبوب‌ترین</option>
              </select>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">قبلی</button>
              <button className="px-4 py-2 bg-black text-white rounded-lg">1</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">بعدی</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
