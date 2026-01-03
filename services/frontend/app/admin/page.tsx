'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Seller, GoldProduct } from '@/lib/types';
import { getImageUrl } from '@/lib/utils';

interface Announcement {
  id: string;
  title: string;
  content: string | null;
  isActive: boolean;
  priority: number;
  createdAt: string;
}

function AdminContent() {
  const { user, logout, token } = useAuth();
  const router = useRouter();
  const [sellerRequests, setSellerRequests] = useState<Seller[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [products, setProducts] = useState<GoldProduct[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');
  const [activeTab, setActiveTab] = useState<'sellers' | 'announcements' | 'products' | 'users' | 'admins' | 'approved-sellers'>('sellers');
  
  // Announcement form
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState('0');
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    if (activeTab === 'sellers') {
      fetchSellerRequests();
    } else if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'approved-sellers') {
      fetchApprovedSellers();
    }
  }, [filter, activeTab, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}/auth/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch users:', response.status);
        return;
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}/auth/admin/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch admins:', response.status);
        return;
      }
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedSellers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.baseURL}/auth/admin/sellers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch sellers:', response.status);
        return;
      }
      const data = await response.json();
      setSellers(data);
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.announcements.getAll(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch announcements:', response.status);
        return;
      }
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.products.getAll(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch products:', response.status);
        return;
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerRequests = async () => {
    try {
      setLoading(true);
      // For now, just fetch pending sellers - filter on frontend
      const response = await fetch(api.auth.getPendingSellers(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        console.error('Failed to fetch seller requests:', response.status);
        return;
      }
      const data = await response.json();
      setSellerRequests(data);
    } catch (error) {
      console.error('Failed to fetch seller requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId: string) => {
    try {
      const response = await fetch(api.auth.approveSeller(sellerId), {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchSellerRequests();
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (sellerId: string) => {
    if (!confirm('Are you sure you want to reject this seller? This will delete their seller profile.')) {
      return;
    }
    try {
      const response = await fetch(api.auth.rejectSeller(sellerId), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchSellerRequests();
      }
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!confirm('آیا مطمئن هستید که میخواهید این کاربر را به ادمین ارتقا دهید?')) {
      return;
    }
    try {
      const response = await fetch(`${api.baseURL}/auth/admin/users/${userId}/promote-to-admin`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert('کاربر با موفقیت به ادمین ارتقا یافت');
        fetchUsers();
        fetchAdmins();
      } else {
        const error = await response.json();
        alert(error.message || 'خطا در ارتقا کاربر');
      }
    } catch (error) {
      console.error('Failed to promote user:', error);
      alert('خطا در ارتقا کاربر');
    }
  };

  const handleLogout = () => {
    console.log('[ADMIN] Logging out...');
    logout();
    router.replace('/login');
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle.trim()) {
      alert('Please enter an announcement title');
      return;
    }

    try {
      const response = await fetch(api.announcements.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: announcementTitle,
          priority: parseInt(announcementPriority),
        }),
      });

      if (response.ok) {
        setAnnouncementTitle('');
        setAnnouncementPriority('0');
        setShowAnnouncementForm(false);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
    }
  };

  const handleToggleAnnouncement = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(api.announcements.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to toggle announcement:', error);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await fetch(api.announcements.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(api.products.delete(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-slate-950 dark:to-slate-900 font-vazirmatn">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
              طلاسین
            </a>
            <span className="text-gray-400">|</span>
            <h1 className="text-xl font-semibold text-gray-700">
              پنل مدیریت
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline">
              خروج
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-right">
          <h2 className="text-3xl font-bold mb-2">سلام، {user?.name}</h2>
          <p className="text-muted-foreground">داشبورد مدیریت</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b overflow-x-auto">
          <Button
            variant={activeTab === 'sellers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('sellers')}
            className="rounded-b-none whitespace-nowrap"
          >
            درخواست‌های فروشنده
          </Button>
          <Button
            variant={activeTab === 'approved-sellers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('approved-sellers')}
            className="rounded-b-none whitespace-nowrap"
          >
            فروشندگان تایید شده
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="rounded-b-none whitespace-nowrap"
          >
            کاربران
          </Button>
          <Button
            variant={activeTab === 'admins' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('admins')}
            className="rounded-b-none whitespace-nowrap"
          >
            ادمین‌ها
          </Button>
          <Button
            variant={activeTab === 'announcements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('announcements')}
            className="rounded-b-none whitespace-nowrap"
          >
            اطلاعیه‌ها
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('products')}
            className="rounded-b-none whitespace-nowrap"
          >
            محصولات
          </Button>
        </div>

        {activeTab === 'sellers' ? (
          <>
            <div className="mb-6 flex gap-2">
              <Button
                variant={filter === 'PENDING' ? 'default' : 'outline'}
                onClick={() => setFilter('PENDING')}
              >
                در انتظار
              </Button>
              <Button
                variant={filter === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilter('ALL')}
              >
                همه
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : sellerRequests.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No seller requests found
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sellerRequests.map((seller) => (
                  <Card key={seller.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-right">{seller.shopName}</CardTitle>
                          <CardDescription className="text-right">
                            درخواست‌دهنده: {seller.user?.name} ({seller.user?.email})
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            seller.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {seller.isApproved ? 'تایید شده' : 'در انتظار'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs text-muted-foreground">
                        درخواست در: {new Date(seller.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                      {!seller.isApproved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(seller.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            تایید
                          </Button>
                          <Button
                            onClick={() => handleReject(seller.id)}
                            variant="destructive"
                          >
                            رد کردن
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'announcements' ? (
          <>
            <div className="mb-6 text-right">
              <Button onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                {showAnnouncementForm ? 'انصراف' : '+ اطلاعیه جدید'}
              </Button>
            </div>

            {showAnnouncementForm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Announcement</CardTitle>
                  <CardDescription>Add a new announcement for the homepage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">عنوان</label>
                    <Input
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      placeholder="مثال: 🏆 فروشندگان برتر هر ماه رو ببینید"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">اولویت (عدد بزرگتر بالاتر نمایش داده می‌شود)</label>
                    <Input
                      type="number"
                      value={announcementPriority}
                      onChange={(e) => setAnnouncementPriority(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleCreateAnnouncement}>ایجاد اطلاعیه</Button>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : announcements.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No announcements found
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <Card key={announcement.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-right">{announcement.title}</CardTitle>
                          <CardDescription className="text-right">
                            اولویت: {announcement.priority} • ایجاد شده در:{' '}
                            {new Date(announcement.createdAt).toLocaleDateString('fa-IR')}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            announcement.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {announcement.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button
                        onClick={() => handleToggleAnnouncement(announcement.id, announcement.isActive)}
                        variant="outline"
                        size="sm"
                      >
                        {announcement.isActive ? 'غیرفعال کن' : 'فعال کن'}
                      </Button>
                      <Button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        variant="destructive"
                        size="sm"
                      >
                        حذف
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'products' ? (
          <>
            {/* Products Tab */}
            <div className="mb-4 text-right">
              <h3 className="text-xl font-semibold">محصولات ({products.length})</h3>
              <p className="text-sm text-muted-foreground">نمایش و مدیریت همه محصولات</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No products found
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={product.images?.[0]?.url ? getImageUrl(product.images[0].url) : 'https://placehold.co/96x96?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 truncate text-right">{product.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1 text-right">
                            {product.description}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">فروشنده:</span>{' '}
                              <span className="font-medium">{product.seller?.shopName || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">قیمت:</span>{' '}
                              <span className="font-medium">{product.finalPrice.toLocaleString('fa-IR')} تومان</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span> {product.weight}g
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span> {product.type}
                            </div>
                            <div>
                              <span className="text-muted-foreground">درصد اجرت:</span> {product.makingFee}%
                            </div>
                            <div>
                              <span className="text-muted-foreground">Profit:</span> {product.profitPercent}%
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            ایجاد شده: {new Date(product.createdAt).toLocaleDateString('fa-IR')}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(`/products/${product.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            مشاهده
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant="destructive"
                            size="sm"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'users' ? (
          <>
            {/* Users Tab */}
            <div className="mb-4 text-right">
              <h3 className="text-xl font-semibold">کاربران ({users.length})</h3>
              <p className="text-sm text-muted-foreground">لیست تمامی کاربران عادی</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : users.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  هیچ کاربری یافت نشد
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}
                          alt={user.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate text-right">{user.name}</CardTitle>
                          <CardDescription className="text-sm truncate text-right">{user.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">نقش:</span>{' '}
                        <span className="font-medium">کاربر</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                      <div className="pt-2">
                        <Button
                          onClick={() => handlePromoteToAdmin(user.id)}
                          variant="default"
                          size="sm"
                          className="w-full"
                        >
                          ارتقا به ادمین
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'admins' ? (
          <>
            {/* Admins Tab */}
            <div className="mb-4 text-right">
              <h3 className="text-xl font-semibold">ادمین‌ها ({admins.length})</h3>
              <p className="text-sm text-muted-foreground">لیست تمامی مدیران سیستم</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : admins.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  هیچ ادمینی یافت نشد
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {admins.map((admin) => (
                  <Card key={admin.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <img
                          src={admin.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(admin.name)}
                          alt={admin.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate text-right">{admin.name}</CardTitle>
                          <CardDescription className="text-sm truncate text-right">{admin.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">نقش:</span>{' '}
                        <span className="font-medium text-orange-600">مدیر</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        عضویت: {new Date(admin.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : activeTab === 'approved-sellers' ? (
          <>
            {/* Approved Sellers Tab */}
            <div className="mb-4 text-right">
              <h3 className="text-xl font-semibold">فروشندگان تایید شده ({sellers.length})</h3>
              <p className="text-sm text-muted-foreground">لیست تمامی فروشندگان فعال</p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : sellers.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  هیچ فروشنده‌ای یافت نشد
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellers.map((seller) => (
                  <Card key={seller.id}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <img
                          src={seller.user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.shopName)}
                          alt={seller.shopName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate text-right">{seller.shopName}</CardTitle>
                          <CardDescription className="text-sm truncate text-right">
                            {seller.user?.name} ({seller.user?.email})
                          </CardDescription>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          فعال
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">تعداد محصولات:</span>{' '}
                          <span className="font-medium">{seller._count?.products || 0}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">نقش:</span>{' '}
                          <span className="font-medium">{seller.user?.role}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        تایید شده در: {new Date(seller.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminContent />
    </ProtectedRoute>
  );
}
