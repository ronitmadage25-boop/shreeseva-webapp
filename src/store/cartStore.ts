import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const maxStock = variant ? (variant.stock || 10) : (product.stock || 10);
          const key = variant ? `${product.id}-${variant.id}` : product.id;
          const existing = state.items.find((item) =>
            variant
              ? item.product.id === product.id && item.selectedVariant?.id === variant.id
              : item.product.id === product.id && !item.selectedVariant
          );
          if (existing) {
            const newQty = Math.min(existing.quantity + quantity, maxStock);
            return {
              items: state.items.map((item) => {
                const itemKey = item.selectedVariant
                  ? `${item.product.id}-${item.selectedVariant.id}`
                  : item.product.id;
                if (itemKey === key) {
                  return { ...item, quantity: newQty };
                }
                return item;
              }),
            };
          }
          const initialQty = Math.min(Math.max(1, quantity), maxStock);
          return {
            items: [
              ...state.items,
              { product, quantity: initialQty, selectedVariant: variant },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter((item) =>
            variantId
              ? !(item.product.id === productId && item.selectedVariant?.id === variantId)
              : item.product.id !== productId
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            const matches = variantId
              ? item.product.id === productId && item.selectedVariant?.id === variantId
              : item.product.id === productId;
            if (matches) {
              const maxStock = item.selectedVariant ? (item.selectedVariant.stock || 10) : (item.product.stock || 10);
              const clampedQty = Math.min(quantity, maxStock);
              return { ...item, quantity: clampedQty };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => {
          const price = item.selectedVariant?.price ?? item.product.price;
          return sum + price * item.quantity;
        }, 0),
    }),
    { name: 'shreeseva-cart' }
  )
);

