// Core product and business types

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  unit: string; // e.g. "1 kg", "500 ml", "1 pc"
  variants?: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags?: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isOnOffer?: boolean;
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. "1 kg", "5 kg"
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image: string;
  productCount?: number;
  color?: string;
  bgColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  status: OrderStatus;
  deliveryType: 'home_delivery' | 'store_pickup';
  address?: Address;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  placedAt: Date;
  estimatedDelivery?: Date;
  trackingSteps?: TrackingStep[];
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  timestamp?: Date;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: Address[];
}

