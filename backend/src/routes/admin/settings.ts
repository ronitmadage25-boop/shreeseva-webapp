import { Router } from 'express';
import { db } from '../../db/index.js';
import { storeSettings, adminActivityLogs } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminSettingsRouter = Router();

adminSettingsRouter.use(verifyAdmin);

// GET /api/admin/settings - Get configurable store settings
adminSettingsRouter.get('/', async (_req, res) => {
  try {
    const settings = await db.query.storeSettings.findFirst();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch store settings.' });
  }
});

// PUT /api/admin/settings - Update store settings
adminSettingsRouter.put('/', async (req: AuthenticatedRequest, res) => {
  try {
    const {
      storeName,
      phone,
      email,
      address,
      operatingHours,
      deliveryFee,
      minOrderValue,
      lowStockThreshold,
      timezone,
    } = req.body;

    const current = await db.query.storeSettings.findFirst();

    if (current) {
      await db
        .update(storeSettings)
        .set({
          storeName: storeName || current.storeName,
          phone: phone || current.phone,
          email: email || current.email,
          address: address || current.address,
          operatingHours: operatingHours || current.operatingHours,
          deliveryFee: deliveryFee !== undefined ? parseFloat(deliveryFee).toFixed(2) : current.deliveryFee,
          minOrderValue: minOrderValue !== undefined ? parseFloat(minOrderValue).toFixed(2) : current.minOrderValue,
          lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : current.lowStockThreshold,
          timezone: timezone || current.timezone,
          updatedAt: new Date(),
        })
        .where(eq(storeSettings.id, current.id));
    } else {
      await db.insert(storeSettings).values({
        id: 'setting-default',
        storeName: storeName || 'Shree Seva Enterprises & Readymade',
        phone: phone || '+91 98765 43210',
        email: email || 'contact@shreeseva.local',
        address: address || 'Station Road, Opp. Primary School, Pachora, Maharashtra 424201',
        operatingHours: operatingHours || '8:00 AM - 9:30 PM (Daily)',
        deliveryFee: deliveryFee !== undefined ? parseFloat(deliveryFee).toFixed(2) : '0.00',
        minOrderValue: minOrderValue !== undefined ? parseFloat(minOrderValue).toFixed(2) : '0.00',
        lowStockThreshold: lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : 10,
        timezone: timezone || 'Asia/Kolkata',
      });
    }

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'SETTINGS_UPDATE',
      details: 'Updated store operational settings & delivery configurations',
      ipAddress: req.ip || 'unknown',
    });

    res.json({ success: true, message: 'Store settings updated successfully.' });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update store settings.' });
  }
});

