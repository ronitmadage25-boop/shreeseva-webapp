import { Router } from 'express';
import { db } from '../../db/index.js';
import { offers, adminActivityLogs } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminOffersRouter = Router();

adminOffersRouter.use(verifyAdmin);

// GET /api/admin/offers - List all coupons
adminOffersRouter.get('/', async (_req, res) => {
  try {
    const list = await db.query.offers.findMany({
      orderBy: [desc(offers.createdAt)],
    });
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch offers.' });
  }
});

// POST /api/admin/offers - Create coupon
adminOffersRouter.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { code, title, description, discountType, discountValue, minOrderValue, maxDiscount, expiryDate } = req.body;

    if (!code || !title || !discountValue) {
      return res.status(400).json({ success: false, message: 'Code, Title, and Discount Value are required.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check unique
    const existing = await db.query.offers.findFirst({
      where: eq(offers.code, cleanCode),
    });

    if (existing) {
      return res.status(400).json({ success: false, message: `Coupon code "${cleanCode}" already exists.` });
    }

    const id = crypto.randomUUID();
    await db.insert(offers).values({
      id,
      code: cleanCode,
      title: title.trim(),
      description: description || null,
      discountType: discountType || 'percentage',
      discountValue: parseFloat(discountValue).toFixed(2),
      minOrderValue: minOrderValue ? parseFloat(minOrderValue).toFixed(2) : '0.00',
      maxDiscount: maxDiscount ? parseFloat(maxDiscount).toFixed(2) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      isActive: true,
    });

    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'OFFER_CREATE',
      details: `Created offer coupon ${cleanCode}`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(201).json({ success: true, message: 'Offer coupon created successfully.' });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ success: false, message: 'Failed to create offer.' });
  }
});

// PATCH /api/admin/offers/:id/toggle - Toggle active status
adminOffersRouter.patch('/:id/toggle', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const existing = await db.query.offers.findFirst({ where: eq(offers.id, id) });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Offer not found.' });
    }

    const newStatus = !existing.isActive;
    await db.update(offers).set({ isActive: newStatus, updatedAt: new Date() }).where(eq(offers.id, id));

    res.json({ success: true, message: `Offer "${existing.code}" is now ${newStatus ? 'Active' : 'Inactive'}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle offer.' });
  }
});

// DELETE /api/admin/offers/:id - Delete coupon
adminOffersRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    await db.delete(offers).where(eq(offers.id, id));
    res.json({ success: true, message: 'Offer coupon removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete offer.' });
  }
});
