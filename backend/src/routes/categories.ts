import { Router } from 'express';
import { db } from '../db/index.js';
import { categories, products } from '../db/schema/index.js';
import { eq, asc } from 'drizzle-orm';

export const categoriesRouter = Router();

// GET /api/categories - List all active categories
categoriesRouter.get('/', async (_req, res) => {
  try {
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.displayOrder));

    res.json({
      success: true,
      count: allCategories.length,
      data: allCategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug - Get single category by slug with its products
categoriesRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
      with: {
        products: true,
      },
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

