import { Link } from 'react-router-dom';
import { Package, ShoppingBag, TrendingUp, DollarSign, LayoutDashboard, LogOut } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'کل محصولات', value: '24', icon: Package, color: 'bg-blue-500' },
    { label: 'سفارشات جدید', value: '12', icon: ShoppingBag, color: 'bg-green-500' },
    { label: 'فروش امروز', value: '45M', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'درآمد ماهانه', value: '850M', icon: DollarSign, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed right-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">تلاسین</h1>
        
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg">
            <LayoutDashboard className="h-5 w-5" />
            داشبورد
          </Link>
          <Link to="/products" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg">
            <Package className="h-5 w-5" />
            محصولات
          </Link>
          <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg">
            <ShoppingBag className="h-5 w-5" />
            سفارشات
          </Link>
        </nav>

        <button className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg mt-auto absolute bottom-6">
          <LogOut className="h-5 w-5" />
          خروج
        </button>
      </aside>

      {/* Main content */}
      <main className="mr-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">داشبورد</h2>
          <p className="text-gray-600">خوش آمدید به پنل مدیریت فروشگاه</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold mb-4">اقدامات سریع</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/products/add" className="btn-primary text-center">
              افزودن محصول جدید
            </Link>
            <button className="btn-secondary">
              مشاهده سفارشات
            </button>
            <button className="btn-secondary">
              تنظیمات فروشگاه
            </button>
          </div>
        </div>

        {/* Recent products */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4">آخرین محصولات</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <h4 className="font-medium">گردنبند طلای {i}</h4>
                  <p className="text-sm text-gray-600">عیار 18</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">25,000,000 تومان</p>
                  <p className="text-sm text-gray-600">موجودی: 5</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
