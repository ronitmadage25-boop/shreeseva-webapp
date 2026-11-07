import { Router } from 'express';
import { db } from '../db/index.js';
import { products, categories } from '../db/schema/index.js';
import { ilike, or } from 'drizzle-orm';

export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  try {
    const q = (req.query.q as string || '').trim();

    if (!q) {
      return res.json({
        success: true,
        query: '',
        categories: [],
        products: [],
      });
    }

    const [matchedCategories, matchedProducts] = await Promise.all([
      db.query.categories.findMany({
        where: or(
          ilike(categories.name, `%${q}%`),
          ilike(categories.description, `%${q}%`)
        ),
        limit: 5,
      }),
      db.query.products.findMany({
        where: or(
          ilike(products.name, `%${q}%`),
          ilike(products.brand, `%${q}%`),
          ilike(products.description, `%${q}%`)
        ),
        limit: 15,
        with: {
          images: true,
          category: true,
        },
      }),
    ]);

    res.json({
      success: true,
      query: q,
      categories: matchedCategories,
      products: matchedProducts,
    });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ success: false, message: 'Failed to search catalog' });
  }
});

