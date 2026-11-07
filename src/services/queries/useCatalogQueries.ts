import { useQuery } from '@tanstack/react-query';
import { api, type ApiCategory, type ApiProduct } from '../api/client';
import { categories as fallbackCategories } from '../../data/categories';
import { allProducts as fallbackProducts } from '../../data/products';
import type { Category, Product } from '../../types';

// Convert backend API category to frontend format
function mapCategory(apiCat: ApiCategory): Category {
  return {
    id: apiCat.id,
    name: apiCat.name,
    slug: apiCat.slug,
    description: apiCat.description || '',
    image: apiCat.imageUrl || '',
    productCount: 50,
    color: '#8F1028',
    bgColor: '#FFF0F3',
  };
}

// Convert backend API product to frontend format
function mapProduct(apiProd: ApiProduct): Product {
  const images = apiProd.images && apiProd.images.length > 0
    ? apiProd.images.map((img) => img.imageUrl)
    : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'];

  return {
    id: apiProd.id,
    name: apiProd.name,
    slug: apiProd.slug,
    description: apiProd.description || '',
    price: parseFloat(apiProd.basePrice),
    originalPrice: apiProd.discountPrice ? parseFloat(apiProd.discountPrice) : parseFloat(apiProd.basePrice),
    discount: apiProd.discountPrice
      ? Math.round(((parseFloat(apiProd.discountPrice) - parseFloat(apiProd.basePrice)) / parseFloat(apiProd.discountPrice)) * 100)
      : 0,
    images,
    category: apiProd.categoryId,
    brand: apiProd.brand,
    unit: apiProd.unitValue || apiProd.unit,
    stock: apiProd.inventory?.stockQuantity ?? (apiProd.inStock ? 50 : 0),
    rating: apiProd.rating ? parseFloat(apiProd.rating) : 4.5,
    reviewCount: apiProd.reviewCount ?? 100,
    isFeatured: apiProd.isFeatured,
    isBestSeller: apiProd.isBestSeller,
    isNewArrival: apiProd.isNewArrival,
    isOnOffer: apiProd.hasOffer,
  };
}

/**
 * Hook to fetch all categories from Neon DB with fallback to local static data
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await api.getCategories();
        if (res.success && res.data.length > 0) {
          return res.data.map(mapCategory);
        }
        return fallbackCategories;
      } catch (err) {
        console.warn('API /api/categories unavailable, using local category data:', err);
        return fallbackCategories;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

/**
 * Hook to fetch best seller products from Neon DB
 */
export function useBestSellersQuery() {
  return useQuery({
    queryKey: ['products', 'best-sellers'],
    queryFn: async () => {
      try {
        const res = await api.getBestSellers();
        if (res.success && res.data.length > 0) {
          return res.data.map(mapProduct);
        }
        return fallbackProducts.filter((p) => p.isBestSeller);
      } catch (err) {
        console.warn('API /api/products/best-sellers unavailable, using local product data:', err);
        return fallbackProducts.filter((p) => p.isBestSeller);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch featured products from Neon DB
 */
export function useFeaturedProductsQuery() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        const res = await api.getFeaturedProducts();
        if (res.success && res.data.length > 0) {
          return res.data.map(mapProduct);
        }
        return fallbackProducts.filter((p) => p.isFeatured || p.isBestSeller);
      } catch (err) {
        console.warn('API /api/products/featured unavailable, using local product data:', err);
        return fallbackProducts.filter((p) => p.isFeatured || p.isBestSeller);
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook to fetch single product by slug from Neon DB
 */
export function useProductQuery(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      if (!slug) return null;
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.data) {
          return mapProduct(res.data);
        }
        return fallbackProducts.find((p) => p.slug === slug) || null;
      } catch (err) {
        console.warn(`API /api/products/${slug} unavailable, using local product data:`, err);
        return fallbackProducts.find((p) => p.slug === slug) || null;
      }
    },
    enabled: Boolean(slug),
  });
}
