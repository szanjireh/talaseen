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
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'ALL'>('PENDING');
  const [activeTab, setActiveTab] = useState<'sellers' | 'announcements' | 'products'>('sellers');
  
  // Announcement form
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState('0');
  const [editingAnnouncement, setEditingAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'sellers') {
      fetchSellerRequests();
    } else if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else {
      fetchProducts();
    }
  }, [filter, activeTab]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.announcements.getAll(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
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
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerRequests = async () => {
    try {
      setLoading(true);
      const url = filter === 'PENDING' ? api.auth.getPendingSellers() : api.auth.getPendingSellers();
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleLogout = () => {
    logout();
    router.push('/login');
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h2>
          <p className="text-muted-foreground">Admin Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b">
          <Button
            variant={activeTab === 'sellers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('sellers')}
            className="rounded-b-none"
          >
            Seller Requests
          </Button>
          <Button
            variant={activeTab === 'announcements' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('announcements')}
            className="rounded-b-none"
          >
            Announcements
          </Button>
          <Button
            variant={activeTab === 'products' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('products')}
            className="rounded-b-none"
          >
            All Products
          </Button>
        </div>

        {activeTab === 'sellers' ? (
          <>
            <div className="mb-6 flex gap-2">
              <Button
                variant={filter === 'PENDING' ? 'default' : 'outline'}
                onClick={() => setFilter('PENDING')}
              >
                Pending Requests
              </Button>
              <Button
                variant={filter === 'ALL' ? 'default' : 'outline'}
                onClick={() => setFilter('ALL')}
              >
                All Requests
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
                          <CardTitle>{seller.shopName}</CardTitle>
                          <CardDescription>
                            Requested by: {seller.user?.name} ({seller.user?.email})
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            seller.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {seller.isApproved ? 'APPROVED' : 'PENDING'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-xs text-muted-foreground">
                        Requested on: {new Date(seller.createdAt).toLocaleDateString()}
                      </div>
                      {!seller.isApproved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(seller.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(seller.id)}
                            variant="destructive"
                          >
                            Reject
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
            <div className="mb-6">
              <Button onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}>
                {showAnnouncementForm ? 'Cancel' : '+ New Announcement'}
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
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={announcementTitle}
                      onChange={(e) => setAnnouncementTitle(e.target.value)}
                      placeholder="e.g., 🏆 Top 100 sellers this month"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority (higher = shows first)</label>
                    <Input
                      type="number"
                      value={announcementPriority}
                      onChange={(e) => setAnnouncementPriority(e.target.value)}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
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
                          <CardTitle className="text-lg">{announcement.title}</CardTitle>
                          <CardDescription>
                            Priority: {announcement.priority} • Created:{' '}
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            announcement.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {announcement.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button
                        onClick={() => handleToggleAnnouncement(announcement.id, announcement.isActive)}
                        variant="outline"
                        size="sm"
                      >
                        {announcement.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Products Tab */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">All Products ({products.length})</h3>
              <p className="text-sm text-muted-foreground">View and manage all products from all sellers</p>
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
                            src={product.images?.[0]?.url || 'https://placehold.co/96x96?text=No+Image'}
                            alt={product.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg mb-1 truncate">{product.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {product.description}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div>
                              <span className="text-muted-foreground">Seller:</span>{' '}
                              <span className="font-medium">{product.seller?.shopName || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Price:</span>{' '}
                              <span className="font-medium">${product.finalPrice.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight:</span> {product.weight}g
                            </div>
                            <div>
                              <span className="text-muted-foreground">Type:</span> {product.type}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Making Fee:</span> ${product.makingFee}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Profit:</span> {product.profitPercent}%
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Created: {new Date(product.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => router.push(`/products/${product.id}`)}
                            variant="outline"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
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
