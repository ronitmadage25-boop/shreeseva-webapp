import { Router } from 'express';
import { db } from '../../db/index.js';
import { categories, adminActivityLogs } from '../../db/schema/index.js';
import { eq, asc } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminCategoriesRouter = Router();

adminCategoriesRouter.use(verifyAdmin);

// GET /api/admin/categories - List all categories with product count
adminCategoriesRouter.get('/', async (_req, res) => {
  try {
    const list = await db.query.categories.findMany({
      orderBy: [asc(categories.displayOrder)],
      with: {
        products: true,
      },
    });

    const formatted = list.map((cat) => ({
      ...cat,
      productCount: cat.products.length,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

// POST /api/admin/categories - Create category
adminCategoriesRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { name, description, imageUrl, displayOrder, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const catId = crypto.randomUUID();
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await db.insert(categories).values({
      id: catId,
      name: name.trim(),
      slug,
      description: description || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
      displayOrder: parseInt(displayOrder, 10) || 10,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'CATEGORY_CREATE',
      details: `Created category "${name}"`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(201).json({ success: true, message: 'Category created successfully.' });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

// PUT /api/admin/categories/:id - Update category
adminCategoriesRouter.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const { name, description, imageUrl, displayOrder, isActive } = req.body;

    const existing = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    await db
      .update(categories)
      .set({
        name: name !== undefined ? name.trim() : existing.name,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        displayOrder: displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id));

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'CATEGORY_UPDATE',
      details: `Updated category "${name || existing.name}"`,
      ipAddress: req.ip || 'unknown',
    });

    res.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Failed to update category.' });
  }
});
