import { Router } from 'express';
import { db } from '../../db/index.js';
import {
  orders,
  orderItems,
  orderStatusHistory,
  adminActivityLogs,
  deliveries,
  deliveryPersonnel,
} from '../../db/schema/index.js';
import { eq, desc, and, or, ilike } from 'drizzle-orm';
import crypto from 'node:crypto';
import { verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminOrdersRouter = Router();

adminOrdersRouter.use(verifyAdmin);

// GET /api/admin/orders - List orders with search, filters & pagination
adminOrdersRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const offset = (page - 1) * limit;

    const status = req.query.status as string | undefined;
    const paymentStatus = req.query.paymentStatus as string | undefined;
    const deliveryType = req.query.deliveryType as string | undefined;
    const search = req.query.search as string | undefined;

    const conditions = [];

    if (status && status !== 'all') {
      conditions.push(eq(orders.orderStatus, status));
    }

    if (paymentStatus && paymentStatus !== 'all') {
      conditions.push(eq(orders.paymentStatus, paymentStatus));
    }

    if (deliveryType && deliveryType !== 'all') {
      conditions.push(eq(orders.deliveryType, deliveryType));
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(orders.orderNumber, q),
          ilike(orders.customerName, q),
          ilike(orders.customerPhone, q)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderList = await db.query.orders.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
        delivery: {
          with: {
            personnel: true,
          },
        },
      },
    });

    res.json({
      success: true,
      page,
      limit,
      count: orderList.length,
      data: orderList,
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

// GET /api/admin/orders/:id - Single order details
adminOrdersRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    const order = await db.query.orders.findFirst({
      where: or(eq(orders.id, id), eq(orders.orderNumber, id)),
      with: {
        items: true,
        statusHistory: {
          orderBy: (hist, { desc }) => [desc(hist.createdAt)],
        },
        delivery: {
          with: {
            personnel: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order details.' });
  }
});

// PATCH /api/admin/orders/:id/status - Update order status (with history & audit log)
adminOrdersRouter.patch('/:id/status', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const { status, comment } = req.body;

    const validStatuses = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition.' });
    }

    const order = await db.query.orders.findFirst({
      where: or(eq(orders.id, id), eq(orders.orderNumber, id)),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Update status in orders table
    const updateData: any = {
      orderStatus: status,
      updatedAt: new Date(),
    };

    if (status === 'delivered') {
      updateData.deliveredAt = new Date();
      updateData.paymentStatus = 'completed';
    }

    await db.update(orders).set(updateData).where(eq(orders.id, order.id));

    // Record in status history
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId: order.id,
      status: status.replace(/_/g, ' ').toUpperCase(),
      comment: comment || `Status updated to ${status} by store owner`,
      changedBy: req.admin?.fullName || 'Store Owner',
    });

    // Record in admin activity logs
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: req.admin?.id,
      action: 'ORDER_STATUS_UPDATE',
      details: `Order #${order.orderNumber} status changed from ${order.orderStatus} to ${status}`,
      ipAddress: req.ip || 'unknown',
    });

    res.json({
      success: true,
      message: `Order #${order.orderNumber} successfully marked as ${status}.`,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

// POST /api/admin/orders/:id/assign-delivery - Assign delivery person
adminOrdersRouter.post('/:id/assign-delivery', async (req: AuthenticatedRequest, res) => {
  try {
    const id = req.params.id as string;
    const { personnelId, estimatedTime } = req.body;

    const order = await db.query.orders.findFirst({
      where: or(eq(orders.id, id), eq(orders.orderNumber, id)),
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Upsert delivery
    const existingDelivery = await db.query.deliveries.findFirst({
      where: eq(deliveries.orderId, order.id),
    });

    if (existingDelivery) {
      await db
        .update(deliveries)
        .set({
          personnelId,
          estimatedTime: estimatedTime || 'Within 2-4 hours',
          status: 'assigned',
          updatedAt: new Date(),
        })
        .where(eq(deliveries.id, existingDelivery.id));
    } else {
      await db.insert(deliveries).values({
        id: crypto.randomUUID(),
        orderId: order.id,
        personnelId,
        status: 'assigned',
        estimatedTime: estimatedTime || 'Within 2-4 hours',
      });
    }

    // Update order status to out_for_delivery if not already
    await db
      .update(orders)
      .set({ orderStatus: 'out_for_delivery', updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    // Status history
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId: order.id,
      status: 'Out for Delivery',
      comment: `Assigned to delivery agent for dispatch`,
      changedBy: req.admin?.fullName || 'Store Owner',
    });

    res.json({
      success: true,
      message: 'Delivery assigned and marked Out for Delivery.',
    });
  } catch (error) {
    console.error('Error assigning delivery:', error);
    res.status(500).json({ success: false, message: 'Failed to assign delivery.' });
  }
});
