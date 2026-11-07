import { Router } from 'express';
import { db } from '../../db/index.js';
import { products, productImages, inventory, categories, adminActivityLogs } from '../../db/schema/index.js';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminProductsRouter = Router();

adminProductsRouter.use(verifyAdmin);

// GET /api/admin/products - List all products with category and stock info
adminProductsRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 30));
    const offset = (page - 1) * limit;

    const categoryId = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const conditions = [];

    if (categoryId && categoryId !== 'all') {
      conditions.push(eq(products.categoryId, categoryId));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(products.name, q),
          ilike(products.brand, q),
          ilike(products.slug, q)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const allProducts = await db.query.products.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(products.createdAt)],
      with: {
        category: true,
        images: true,
        inventory: true,
      },
    });

    res.json({
      success: true,
      page,
      limit,
      count: allProducts.length,
      data: allProducts,
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
});

// POST /api/admin/products - Create new product
adminProductsRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      name,
      categoryId,
      brand,
      description,
      basePrice,
      discountPrice,
      unit,
      unitValue,
      stockQuantity,
      imageUrl,
      isFeatured,
      isBestSeller,
      isNewArrival,
      hasOffer,
      badge,
    } = req.body;

    if (!name || !categoryId || !basePrice || !unitValue) {
      return res.status(400).json({
        success: false,
        message: 'Name, Category, Base Price, and Unit Value are required.',
      });
    }

    const productId = crypto.randomUUID();
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Insert Product
    await db.insert(products).values({
      id: productId,
      categoryId,
      name,
      slug,
      brand: brand || 'Shree Seva',
      description: description || '',
      basePrice: parseFloat(basePrice).toFixed(2),
      discountPrice: discountPrice ? parseFloat(discountPrice).toFixed(2) : null,
      unit: unit || 'pack',
      unitValue,
      inStock: (parseInt(stockQuantity, 10) || 50) > 0,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: Boolean(isNewArrival),
      hasOffer: Boolean(hasOffer),
      badge: badge || null,
      rating: '4.50',
      reviewCount: 0,
    });

    // Insert Image
    const defaultImage = imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80';
    await db.insert(productImages).values({
      id: crypto.randomUUID(),
      productId,
      imageUrl: defaultImage,
      altText: name,
      isPrimary: true,
      displayOrder: 1,
    });

    // Insert Inventory
    await db.insert(inventory).values({
      id: crypto.randomUUID(),
      productId,
      stockQuantity: parseInt(stockQuantity, 10) || 50,
      lowStockThreshold: 10,
      isAvailable: true,
    });

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'PRODUCT_CREATE',
      details: `Created product "${name}" (₹${basePrice}) in category ${categoryId}`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { productId, slug },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

// PUT /api/admin/products/:id - Update product
adminProductsRouter.put('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const {
      name,
      categoryId,
      brand,
      description,
      basePrice,
      discountPrice,
      unit,
      unitValue,
      stockQuantity,
      imageUrl,
      isFeatured,
      isBestSeller,
      isNewArrival,
      hasOffer,
      inStock,
      badge,
    } = req.body;

    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const newStock = stockQuantity !== undefined ? parseInt(stockQuantity, 10) : undefined;

    await db
      .update(products)
      .set({
        name: name ?? existing.name,
        categoryId: categoryId ?? existing.categoryId,
        brand: brand ?? existing.brand,
        description: description ?? existing.description,
        basePrice: basePrice ? parseFloat(basePrice).toFixed(2) : existing.basePrice,
        discountPrice: discountPrice ? parseFloat(discountPrice).toFixed(2) : existing.discountPrice,
        unit: unit ?? existing.unit,
        unitValue: unitValue ?? existing.unitValue,
        inStock: inStock !== undefined ? inStock : (newStock !== undefined ? newStock > 0 : existing.inStock),
        isFeatured: isFeatured !== undefined ? isFeatured : existing.isFeatured,
        isBestSeller: isBestSeller !== undefined ? isBestSeller : existing.isBestSeller,
        isNewArrival: isNewArrival !== undefined ? isNewArrival : existing.isNewArrival,
        hasOffer: hasOffer !== undefined ? hasOffer : existing.hasOffer,
        badge: badge !== undefined ? badge : existing.badge,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    // Update inventory if stock passed
    if (newStock !== undefined) {
      await db
        .update(inventory)
        .set({
          stockQuantity: newStock,
          isAvailable: newStock > 0,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, id));
    }

    // Update image if passed
    if (imageUrl) {
      const primaryImg = await db.query.productImages.findFirst({
        where: and(eq(productImages.productId, id), eq(productImages.isPrimary, true)),
      });
      if (primaryImg) {
        await db
          .update(productImages)
          .set({ imageUrl, altText: name || existing.name })
          .where(eq(productImages.id, primaryImg.id));
      } else {
        await db.insert(productImages).values({
          id: crypto.randomUUID(),
          productId: id,
          imageUrl,
          altText: name || existing.name,
          isPrimary: true,
        });
      }
    }

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'PRODUCT_UPDATE',
      details: `Updated product "${existing.name}" (ID: ${id})`,
      ipAddress: req.ip || 'unknown',
    });

    res.json({
      success: true,
      message: 'Product updated successfully.',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

// DELETE /api/admin/products/:id - Delete product or set out of stock
adminProductsRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const existing = await db.query.products.findFirst({
      where: eq(products.id, id),
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Delete product (cascades to images & inventory)
    await db.delete(products).where(eq(products.id, id));

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'PRODUCT_DELETE',
      details: `Deleted product "${existing.name}" (ID: ${id})`,
      ipAddress: req.ip || 'unknown',
    });

    res.json({
      success: true,
      message: `Product "${existing.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});
