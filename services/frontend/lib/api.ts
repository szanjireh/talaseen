const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const api = {
  baseURL: API_URL,

  // Auth endpoints
  auth: {
    googleLogin: () => `${API_URL}/auth/google`,
    getProfile: () => `${API_URL}/auth/me`,
    requestSeller: () => `${API_URL}/auth/request-seller`,
    getMySeller: () => `${API_URL}/auth/my-seller`,
    getPendingSellers: () => `${API_URL}/auth/admin/pending-sellers`,
    approveSeller: (id: string) => `${API_URL}/auth/admin/sellers/${id}/approve`,
    rejectSeller: (id: string) => `${API_URL}/auth/admin/sellers/${id}/reject`,
    sendOtp: () => `${API_URL}/auth/sms/send-otp`,
    verifyOtp: () => `${API_URL}/auth/sms/verify-otp`,
  },

  // Product endpoints (gold products)
  products: {
    search: (query: string, params?: Record<string, string>) => {
      const searchParams = new URLSearchParams({ q: query, ...params });
      return `${API_URL}/products/search?${searchParams}`;
    },
    getAll: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return `${API_URL}/products${query}`;
    },
    getMyProducts: () => `${API_URL}/products/my-products`,
    getById: (id: string) => `${API_URL}/products/${id}`,
    create: () => `${API_URL}/products`,
    update: (id: string) => `${API_URL}/products/${id}`,
    delete: (id: string) => `${API_URL}/products/${id}`,
    like: (id: string) => `${API_URL}/products/${id}/like`,
    unlike: (id: string) => `${API_URL}/products/${id}/like`,
    getLikes: (id: string) => `${API_URL}/products/${id}/likes`,
    getMyLiked: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params)}` : '';
      return `${API_URL}/products/liked/my-liked${query}`;
    },
  },

  // Upload endpoints
  upload: {
    image: () => `${API_URL}/upload/image`,
    images: () => `${API_URL}/upload/images`,
  },

  // Announcements endpoints
  announcements: {
    getActive: () => `${API_URL}/announcements/active`,
    getAll: () => `${API_URL}/announcements`,
    create: () => `${API_URL}/announcements`,
    update: (id: string) => `${API_URL}/announcements/${id}`,
    delete: (id: string) => `${API_URL}/announcements/${id}`,
  },
};

export default api;
