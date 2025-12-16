import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Upload } from 'lucide-react';

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goldPurity: '',
    weight: '',
    price: '',
    stock: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product creation
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
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
        <div className="mb-8">
          <Link to="/products" className="flex items-center gap-2 text-gray-600 hover:text-black mb-4">
            <ArrowRight className="h-5 w-5" />
            بازگشت به لیست محصولات
          </Link>
          <h2 className="text-3xl font-bold mb-2">افزودن محصول جدید</h2>
          <p className="text-gray-600">اطلاعات محصول طلای خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold mb-4">اطلاعات اصلی</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان محصول</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">توضیحات</label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">دسته‌بندی</label>
                  <select className="input-field" required>
                    <option value="">انتخاب کنید</option>
                    <option value="necklace">گردنبند</option>
                    <option value="ring">حلقه</option>
                    <option value="bracelet">دستبند</option>
                    <option value="earring">گوشواره</option>
                    <option value="bangle">النگو</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">عیار طلا</label>
                  <select className="input-field" required>
                    <option value="">انتخاب کنید</option>
                    <option value="18k">18 عیار</option>
                    <option value="21k">21 عیار</option>
                    <option value="22k">22 عیار</option>
                    <option value="24k">24 عیار</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">وزن (گرم)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">قیمت (تومان)</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">موجودی</label>
                  <input
                    type="number"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold mb-4">تصاویر محصول</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">تصاویر را اینجا بکشید یا کلیک کنید</p>
              <input type="file" multiple accept="image/*" className="hidden" />
              <button type="button" className="btn-secondary mt-2">
                انتخاب فایل
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              ذخیره محصول
            </button>
            <Link to="/products" className="btn-secondary">
              انصراف
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
