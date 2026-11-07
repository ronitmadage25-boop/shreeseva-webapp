import { Router } from 'express';
import { db } from '../../db/index.js';
import { deliveries, deliveryPersonnel, orders } from '../../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin } from '../../middleware/auth.js';

export const adminDeliveriesRouter = Router();

adminDeliveriesRouter.use(verifyAdmin);

// GET /api/admin/deliveries - List deliveries
adminDeliveriesRouter.get('/', async (_req, res) => {
  try {
    const list = await db.query.deliveries.findMany({
      orderBy: [desc(deliveries.createdAt)],
      with: {
        order: {
          with: {
            items: true,
          },
        },
        personnel: true,
      },
    });

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch deliveries.' });
  }
});

// GET /api/admin/deliveries/personnel - List delivery drivers/personnel
adminDeliveriesRouter.get('/personnel', async (_req, res) => {
  try {
    const list = await db.query.deliveryPersonnel.findMany({
      orderBy: [desc(deliveryPersonnel.createdAt)],
    });

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching delivery personnel:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch delivery team.' });
  }
});

// POST /api/admin/deliveries/personnel - Register new delivery partner
adminDeliveriesRouter.post('/personnel', async (req, res) => {
  try {
    const { fullName, phone, vehicleType, vehicleNumber } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ success: false, message: 'Full name and phone are required.' });
    }

    const id = crypto.randomUUID();
    await db.insert(deliveryPersonnel).values({
      id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      vehicleType: vehicleType || 'Motorcycle',
      vehicleNumber: vehicleNumber || 'MH 19',
      isActive: true,
    });

    res.status(201).json({ success: true, message: 'Delivery partner registered.' });
  } catch (error) {
    console.error('Error adding delivery partner:', error);
    res.status(500).json({ success: false, message: 'Failed to add delivery partner.' });
  }
});

