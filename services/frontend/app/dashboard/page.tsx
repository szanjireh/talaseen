'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProductForm } from '@/components/add-product-form';
import { EditProductForm } from '@/components/edit-product-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  type: string;
  weight: number;
  finalPrice: number;
  makingFee: number;
  profitPercent: number;
  images: { url: string; isPrimary: boolean }[];
  createdAt: string;
}

function DashboardContent() {
  const { user, logout, token, login } = useAuth();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellerStatus, setSellerStatus] = useState<{
    isApproved: boolean;
    shopName: string;
  } | null>(null);

  // Fetch seller status on mount
  useEffect(() => {
    const fetchSellerStatus = async () => {
      try {
        const response = await fetch(api.auth.getMySeller(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const seller = await response.json();
          setSellerStatus({
            isApproved: seller?.isApproved || false,
            shopName: seller?.shopName || user?.shopName || '',
          });

          // Update user in auth context if needed
          if (seller && user) {
            login(token!, {
              ...user,
              shopName: seller.shopName,
              isApproved: seller.isApproved,
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch seller status:', error);
      }
    };

    if (token) {
      fetchSellerStatus();
    }
  }, [token]);

  useEffect(() => {
    const isApproved = sellerStatus?.isApproved ?? user?.isApproved;
    if (isApproved) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [sellerStatus, user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.products.getMyProducts(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductCreated = () => {
    setShowAddForm(false);
    fetchProducts();
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این محصول را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(api.products.delete(productId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('محصول با موفقیت حذف شد');
        fetchProducts();
      } else {
        alert('حذف محصول ناموفق بود');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('حذف محصول ناموفق بود');
    }
  };

  const handleLogout = () => {
    console.log('[DASHBOARD] Logging out...');
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              طلاسین
            </a>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-700">پنل فروشنده</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            خروج
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">خوش آمدید، {user?.name}!</h2>
          <p className="text-muted-foreground">
            مدیریت فروشگاه:{' '}
            <span className="font-semibold">{sellerStatus?.shopName || user?.shopName}</span>
          </p>
        </div>

        {/* Approval Status Warning */}
        {!(sellerStatus?.isApproved ?? user?.isApproved) && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <p className="text-yellow-800 font-semibold">
                ⏳ حساب فروشنده شما در انتظار تایید ادمین است. پس از تایید می‌توانید محصول اضافه
                کنید.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                محصولات من
              </CardTitle>
              <CardDescription>مجموع موجودی</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{products.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ارزش کل</CardTitle>
              <CardDescription>ارزش موجودی</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                ${products.reduce((sum, p) => sum + p.finalPrice, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>وضعیت</CardTitle>
              <CardDescription>تایید حساب</CardDescription>
            </CardHeader>
            <CardContent>
              <span
                className={`text-lg font-semibold ${(sellerStatus?.isApproved ?? user?.isApproved) ? 'text-green-600' : 'text-yellow-600'}`}
              >
                {(sellerStatus?.isApproved ?? user?.isApproved) ? '✅ تایید شده' : '⏳ در انتظار'}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        {(sellerStatus?.isApproved ?? user?.isApproved) && !showAddForm && (
          <div className="mb-6">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              افزودن محصول جدید
            </Button>
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddProductForm
              onSuccess={handleProductCreated}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="mb-8">
            <EditProductForm
              product={editingProduct}
              onSuccess={handleProductUpdated}
              onCancel={() => setEditingProduct(null)}
            />
          </div>
        )}

        {/* Products List */}
        {user?.isApproved && (
          <Card>
            <CardHeader>
              <CardTitle>محصولات شما</CardTitle>
              <CardDescription>{products.length} محصول ثبت شده</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">در حال بارگذاری محصولات...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">هنوز محصولی ندارید</p>
                  <Button onClick={() => setShowAddForm(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    اولین محصول خود را اضافه کنید
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(
                            product.images.find((img) => img.isPrimary)?.url ||
                              product.images[0]?.url ||
                              ''
                          )}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{product.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-600 mt-1">
                          <span>{product.type}</span>
                          <span>•</span>
                          <span>{product.weight}g</span>
                          <span>•</span>
                          <span className="font-medium text-orange-600">
                            ${product.finalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-3 text-xs text-gray-500 mt-1">
                          <span>درصد اجرت: {product.makingFee}%</span>
                          <span>•</span>
                          <span>سود: {product.profitPercent}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            مشاهده
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
