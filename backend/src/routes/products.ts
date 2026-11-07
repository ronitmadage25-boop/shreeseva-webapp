import { Router } from 'express';
import { db } from '../db/index.js';
import { products, categories, productImages, inventory } from '../db/schema/index.js';
import { eq, and, gte, lte, asc, desc, ilike, or } from 'drizzle-orm';

export const productsRouter = Router();

// GET /api/products/featured - Featured products
productsRouter.get('/featured', async (_req, res) => {
  try {
    const data = await db.query.products.findMany({
      where: eq(products.isFeatured, true),
      limit: 10,
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
});

// GET /api/products/best-sellers - Best seller products
productsRouter.get('/best-sellers', async (_req, res) => {
  try {
    const data = await db.query.products.findMany({
      where: eq(products.isBestSeller, true),
      limit: 12,
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch best sellers' });
  }
});

// GET /api/products/new-arrivals - New arrivals
productsRouter.get('/new-arrivals', async (_req, res) => {
  try {
    const data = await db.query.products.findMany({
      where: eq(products.isNewArrival, true),
      limit: 12,
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch new arrivals' });
  }
});

// GET /api/products/offers - Products with discounts/offers
productsRouter.get('/offers', async (_req, res) => {
  try {
    const data = await db.query.products.findMany({
      where: eq(products.hasOffer, true),
      limit: 12,
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers' });
  }
});

// GET /api/products - Paginated, filtered, sorted list
productsRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const offset = (page - 1) * limit;

    const categoryParam = req.query.category as string | undefined;
    const brandParam = req.query.brand as string | undefined;
    const minPriceParam = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
    const maxPriceParam = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
    const inStockParam = req.query.inStock === 'true';
    const sortParam = (req.query.sort as string) || 'popular';

    const conditions = [];

    if (categoryParam) {
      // Find category by slug or ID
      const cat = await db.query.categories.findFirst({
        where: or(eq(categories.slug, categoryParam), eq(categories.id, categoryParam)),
      });
      if (cat) {
        conditions.push(eq(products.categoryId, cat.id));
      }
    }

    if (brandParam) {
      conditions.push(ilike(products.brand, `%${brandParam}%`));
    }

    if (minPriceParam !== undefined && !isNaN(minPriceParam)) {
      conditions.push(gte(products.basePrice, minPriceParam.toString()));
    }

    if (maxPriceParam !== undefined && !isNaN(maxPriceParam)) {
      conditions.push(lte(products.basePrice, maxPriceParam.toString()));
    }

    if (inStockParam) {
      conditions.push(eq(products.inStock, true));
    }

    let orderByClause;
    switch (sortParam) {
      case 'price_asc':
        orderByClause = asc(products.basePrice);
        break;
      case 'price_desc':
        orderByClause = desc(products.basePrice);
        break;
      case 'rating':
        orderByClause = desc(products.rating);
        break;
      case 'newest':
        orderByClause = desc(products.createdAt);
        break;
      case 'popular':
      default:
        orderByClause = desc(products.isBestSeller);
        break;
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.query.products.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: orderByClause,
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });

    res.json({
      success: true,
      page,
      limit,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// GET /api/products/:slug - Product details
productsRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: true,
        inventory: true,
        category: true,
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});

