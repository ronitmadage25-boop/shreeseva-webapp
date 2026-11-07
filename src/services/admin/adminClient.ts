/**
 * Shree Seva Admin API Client
 * Protected owner administration endpoints communicating with Express backend.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getStoredToken(): string | null {
  return localStorage.getItem('shree_seva_admin_token');
}

async function adminRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // sends HTTP-only cookie automatically
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const adminApi = {
  // Authentication
  login: (credentials: { username: string; password: string; rememberMe?: boolean }) =>
    adminRequest<{
      success: boolean;
      token: string;
      admin: {
        id: string;
        username: string;
        fullName: string;
        email: string | null;
        phone: string;
        role: string;
        isTemporaryPassword: boolean;
      };
    }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    adminRequest<{
      success: boolean;
      admin: {
        id: string;
        username: string;
        fullName: string;
        email: string | null;
        phone: string;
        role: string;
        isTemporaryPassword: boolean;
      };
    }>('/admin/auth/me'),

  changePassword: (data: { currentPassword?: string; newPassword: string }) =>
    adminRequest<{ success: boolean; message: string }>('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    adminRequest<{ success: boolean }>('/admin/auth/logout', { method: 'POST' }),

  // Dashboard Overview
  getDashboardSummary: () =>
    adminRequest<{
      success: boolean;
      data: {
        kpi: {
          totalRevenue: number;
          totalOrders: number;
          totalCustomers: number;
          averageOrderValue: number;
          pendingOrders: number;
          completedOrders: number;
          inStockProducts: number;
          lowStockProducts: number;
        };
        recentOrders: any[];
        lowStockItems: any[];
        deliveryBreakdown: any[];
      };
    }>('/admin/dashboard/summary'),

  // Analytics
  getAnalyticsOverview: (range = '30d', startDate?: string, endDate?: string) => {
    const params = new URLSearchParams({ range });
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    return adminRequest<{ success: boolean; range: string; data: any }>(
      `/admin/analytics/overview?${params.toString()}`
    );
  },

  // Orders
  getOrders: (params?: { status?: string; paymentStatus?: string; deliveryType?: string; search?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.paymentStatus) qs.set('paymentStatus', params.paymentStatus);
    if (params?.deliveryType) qs.set('deliveryType', params.deliveryType);
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', params.page.toString());
    if (params?.limit) qs.set('limit', params.limit.toString());
    return adminRequest<{ success: boolean; count: number; page: number; data: any[] }>(`/admin/orders?${qs.toString()}`);
  },

  getOrderById: (id: string) =>
    adminRequest<{ success: boolean; data: any }>(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string, comment?: string) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    }),

  assignDelivery: (id: string, personnelId: string, estimatedTime?: string) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/orders/${id}/assign-delivery`, {
      method: 'POST',
      body: JSON.stringify({ personnelId, estimatedTime }),
    }),

  // Products
  getProducts: (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', params.page.toString());
    if (params?.limit) qs.set('limit', params.limit.toString());
    return adminRequest<{ success: boolean; count: number; page: number; data: any[] }>(`/admin/products?${qs.toString()}`);
  },

  createProduct: (productData: any) =>
    adminRequest<{ success: boolean; message: string; data: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  updateProduct: (id: string, productData: any) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    }),

  deleteProduct: (id: string) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  // Inventory
  getInventory: (filter?: 'all' | 'low' | 'out') =>
    adminRequest<{ success: boolean; count: number; data: any[] }>(`/admin/inventory${filter ? `?filter=${filter}` : ''}`),

  adjustStock: (productId: string, newStock: number, reason: string) =>
    adminRequest<{ success: boolean; message: string }>('/admin/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ productId, newStock, reason }),
    }),

  getInventoryLogs: () =>
    adminRequest<{ success: boolean; count: number; data: any[] }>('/admin/inventory/logs'),

  // Categories
  getCategories: () =>
    adminRequest<{ success: boolean; count: number; data: any[] }>('/admin/categories'),

  createCategory: (catData: any) =>
    adminRequest<{ success: boolean; message: string }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    }),

  updateCategory: (id: string, catData: any) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData),
    }),

  // Customers
  getCustomers: (search?: string) =>
    adminRequest<{ success: boolean; count: number; data: any[] }>(
      `/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`
    ),

  getCustomerById: (id: string) =>
    adminRequest<{ success: boolean; data: any }>(`/admin/customers/${id}`),

  // Deliveries
  getDeliveries: () =>
    adminRequest<{ success: boolean; count: number; data: any[] }>('/admin/deliveries'),

  getDeliveryPersonnel: () =>
    adminRequest<{ success: boolean; count: number; data: any[] }>('/admin/deliveries/personnel'),

  createDeliveryPersonnel: (data: any) =>
    adminRequest<{ success: boolean; message: string }>('/admin/deliveries/personnel', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Offers
  getOffers: () =>
    adminRequest<{ success: boolean; count: number; data: any[] }>('/admin/offers'),

  createOffer: (offerData: any) =>
    adminRequest<{ success: boolean; message: string }>('/admin/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    }),

  toggleOffer: (id: string) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/offers/${id}/toggle`, {
      method: 'PATCH',
    }),

  deleteOffer: (id: string) =>
    adminRequest<{ success: boolean; message: string }>(`/admin/offers/${id}`, {
      method: 'DELETE',
    }),

  // Activity Logs
  getActivityLogs: (page = 1) =>
    adminRequest<{ success: boolean; count: number; data: any[] }>(`/admin/activity-logs?page=${page}`),

  // Settings
  getSettings: () =>
    adminRequest<{ success: boolean; data: any }>('/admin/settings'),

  updateSettings: (settingsData: any) =>
    adminRequest<{ success: boolean; message: string }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    }),
};

