/**
 * Shree Seva Enterprises & Readymade API Client
 * Connects frontend to Express + Neon PostgreSQL backend with offline fallbacks.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ApiProduct {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  brand: string;
  description: string | null;
  basePrice: string;
  discountPrice: string | null;
  unit: string;
  unitValue: string;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  hasOffer: boolean;
  rating: string | null;
  reviewCount: number | null;
  badge: string | null;
  images?: Array<{ id: string; imageUrl: string; altText: string | null; isPrimary: boolean }>;
  inventory?: { stockQuantity: number; lowStockThreshold: number; isAvailable: boolean };
  category?: ApiCategory;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  deliveryType: 'home_delivery' | 'store_pickup';
  deliveryAddress?: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'counter';
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  items: Array<{
    productId?: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productImage?: string;
    unitValue?: string;
  }>;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `API request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; database: { status: string } }>('/health'),

  // Store details
  getStoreInfo: () => request<any>('/store'),

  // Categories
  getCategories: () => request<{ success: boolean; data: ApiCategory[] }>('/categories'),
  getCategoryBySlug: (slug: string) =>
    request<{ success: boolean; data: ApiCategory & { products: ApiProduct[] } }>(`/categories/${slug}`),

  // Products
  getProducts: (params?: {
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.brand) query.set('brand', params.brand);
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params?.inStock) query.set('inStock', 'true');
    if (params?.sort) query.set('sort', params.sort);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());

    const qs = query.toString();
    return request<{ success: boolean; data: ApiProduct[]; count: number }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductBySlug: (slug: string) =>
    request<{ success: boolean; data: ApiProduct }>(`/products/${slug}`),

  getFeaturedProducts: () =>
    request<{ success: boolean; data: ApiProduct[] }>('/products/featured'),

  getBestSellers: () =>
    request<{ success: boolean; data: ApiProduct[] }>('/products/best-sellers'),

  getNewArrivals: () =>
    request<{ success: boolean; data: ApiProduct[] }>('/products/new-arrivals'),

  getOffers: () =>
    request<{ success: boolean; data: ApiProduct[] }>('/products/offers'),

  // Search
  search: (q: string) =>
    request<{ success: boolean; query: string; categories: ApiCategory[]; products: ApiProduct[] }>(
      `/search?q=${encodeURIComponent(q)}`
    ),

  // Orders
  createOrder: (payload: CreateOrderPayload) =>
    request<{
      success: boolean;
      message: string;
      data: { orderId: string; orderNumber: string; totalAmount: number; deliveryType: string; placedAt: string };
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  trackOrder: (orderNumber: string) =>
    request<{ success: boolean; data: any }>(`/orders/track/${encodeURIComponent(orderNumber)}`),
};

