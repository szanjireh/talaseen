'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AddProductForm } from '@/components/add-product-form';
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
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isApproved) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.products.getAll(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        // Filter products for this seller only (backend should handle this, but client-side filter as fallback)
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(api.products.delete(productId), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Product deleted successfully');
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Seller Dashboard
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground">
            Manage your shop: <span className="font-semibold">{user?.shopName}</span>
          </p>
        </div>

        {/* Approval Status Warning */}
        {!user?.isApproved && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="py-4">
              <p className="text-yellow-800 font-semibold">
                ⏳ Your seller account is pending admin approval. You'll be able to add products once approved.
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
                My Products
              </CardTitle>
              <CardDescription>Total inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{products.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Value</CardTitle>
              <CardDescription>Inventory worth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-600">
                ${products.reduce((sum, p) => sum + p.finalPrice, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Account approval</CardDescription>
            </CardHeader>
            <CardContent>
              <span className={`text-lg font-semibold ${user?.isApproved ? 'text-green-600' : 'text-yellow-600'}`}>
                {user?.isApproved ? '✅ Approved' : '⏳ Pending'}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Button */}
        {user?.isApproved && !showAddForm && (
          <div className="mb-6">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-600 hover:bg-orange-700"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Product
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

        {/* Products List */}
        {user?.isApproved && (
          <Card>
            <CardHeader>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>
                {products.length} {products.length === 1 ? 'product' : 'products'} listed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No products yet</p>
                  <Button onClick={() => setShowAddForm(true)} variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Product
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
                          src={product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop'}
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
                          <span>Making Fee: ${product.makingFee}</span>
                          <span>•</span>
                          <span>Profit: {product.profitPercent}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
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
