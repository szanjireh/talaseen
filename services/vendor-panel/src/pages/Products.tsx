import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function Products() {
  const products = Array(10).fill(null).map((_, i) => ({
    id: i + 1,
    title: `محصول ${i + 1}`,
    price: 25000000 + i * 1000000,
    stock: 5 + i,
    status: i % 2 === 0 ? 'active' : 'inactive',
    image: '/placeholder.jpg'
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - same as dashboard */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">تلاسین</h1>
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg">
            داشبورد
          </Link>
          <Link to="/products" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
            محصولات
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="mr-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">مدیریت محصولات</h2>
            <p className="text-gray-600">مشاهده و مدیریت محصولات فروشگاه</p>
          </div>
          <Link to="/products/add" className="btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            افزودن محصول
          </Link>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl p-4 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی محصول..."
              className="w-full pr-10 input-field"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg">
            <option>همه وضعیت‌ها</option>
            <option>فعال</option>
            <option>غیرفعال</option>
          </select>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">محصول</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">قیمت</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">موجودی</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">وضعیت</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.price.toLocaleString('fa-IR')} تومان</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {product.status === 'active' ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
