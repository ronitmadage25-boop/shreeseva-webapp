import { Router } from 'express';
import { db } from '../../db/index.js';
import { inventory, products, inventoryLogs, adminActivityLogs } from '../../db/schema/index.js';
import { eq, desc, lte, and } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminInventoryRouter = Router();

adminInventoryRouter.use(verifyAdmin);

// GET /api/admin/inventory - List stock status across products
adminInventoryRouter.get('/', async (req, res) => {
  try {
    const filter = req.query.filter as string | undefined; // 'all' | 'low' | 'out'

    const allInventory = await db.query.inventory.findMany({
      orderBy: [desc(inventory.updatedAt)],
      with: {
        product: {
          with: {
            category: true,
            images: true,
          },
        },
      },
    });

    let filtered = allInventory;
    if (filter === 'low') {
      filtered = allInventory.filter((item) => item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold);
    } else if (filter === 'out') {
      filtered = allInventory.filter((item) => item.stockQuantity <= 0 || !item.isAvailable);
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, message: 'Failed to load inventory.' });
  }
});

// POST /api/admin/inventory/adjust - Manual stock correction with mandatory audit reason
adminInventoryRouter.post('/adjust', async (req: AuthenticatedRequest, res) => {
  try {
    const { productId, newStock, reason } = req.body;

    if (!productId || newStock === undefined || !reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, New Stock quantity, and a valid Reason are required.',
      });
    }

    const stockNum = parseInt(newStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock quantity must be a non-negative number.',
      });
    }

    const currentInv = await db.query.inventory.findFirst({
      where: eq(inventory.productId, productId),
      with: { product: true },
    });

    if (!currentInv) {
      return res.status(404).json({ success: false, message: 'Inventory record not found.' });
    }

    const prevStock = currentInv.stockQuantity;
    const adjustmentQty = stockNum - prevStock;

    // Update inventory table
    await db
      .update(inventory)
      .set({
        stockQuantity: stockNum,
        isAvailable: stockNum > 0,
        updatedAt: new Date(),
      })
      .where(eq(inventory.productId, productId));

    // Update product inStock flag
    await db
      .update(products)
      .set({
        inStock: stockNum > 0,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    // Insert into inventory audit logs
    await db.insert(inventoryLogs).values({
      id: crypto.randomUUID(),
      productId,
      previousStock: prevStock,
      newStock: stockNum,
      adjustmentQuantity: adjustmentQty,
      reason: reason.trim(),
      actorId: req.admin?.id,
    });

    // Insert into admin activity logs
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'STOCK_ADJUSTMENT',
      details: `Adjusted stock for "${currentInv.product?.name}" from ${prevStock} to ${stockNum}. Reason: ${reason.trim()}`,
      ipAddress: req.ip || 'unknown',
    });

    res.json({
      success: true,
      message: `Stock updated to ${stockNum} units.`,
    });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    res.status(500).json({ success: false, message: 'Failed to adjust stock.' });
  }
});

// GET /api/admin/inventory/logs - View audit history of stock adjustments
adminInventoryRouter.get('/logs', async (_req, res) => {
  try {
    const logs = await db.query.inventoryLogs.findMany({
      limit: 50,
      orderBy: [desc(inventoryLogs.createdAt)],
      with: {
        product: true,
        actor: true,
      },
    });

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching inventory logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch inventory logs.' });
  }
});

