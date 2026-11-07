import { Router } from 'express';
import { db } from '../db/index.js';
import {
  orders,
  orderItems,
  orderStatusHistory,
  deliveries,
  payments,
} from '../db/schema/index.js';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';
import crypto from 'node:crypto';

export const ordersRouter = Router();

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(10),
  deliveryType: z.enum(['home_delivery', 'store_pickup']).default('home_delivery'),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(['cod', 'upi', 'card', 'counter']).default('cod'),
  subtotal: z.number().positive(),
  deliveryFee: z.number().default(0),
  discount: z.number().default(0),
  totalAmount: z.number().positive(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string().optional(),
      productName: z.string().min(1),
      unitPrice: z.number().positive(),
      quantity: z.number().int().positive(),
      totalPrice: z.number().positive(),
      productImage: z.string().optional(),
      unitValue: z.string().optional(),
    })
  ).min(1),
});

// POST /api/orders - Create a new order
ordersRouter.post('/', async (req, res) => {
  try {
    const parseResult = createOrderSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order input data',
        errors: parseResult.error.format(),
      });
    }

    const data = parseResult.data;
    const orderId = crypto.randomUUID();
    // Unique human-readable order number e.g. SS-842910
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `SS-${randomDigits}`;

    // Insert order
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      deliveryType: data.deliveryType,
      deliveryAddress: data.deliveryAddress || null,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'cod' || data.paymentMethod === 'counter' ? 'pending' : 'completed',
      orderStatus: 'placed',
      subtotal: data.subtotal.toString(),
      deliveryFee: data.deliveryFee.toString(),
      discount: data.discount.toString(),
      totalAmount: data.totalAmount.toString(),
      notes: data.notes || null,
    });

    // Insert order items
    const itemsToInsert = data.items.map((item) => ({
      id: crypto.randomUUID(),
      orderId,
      productId: item.productId || null,
      productName: item.productName,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity,
      totalPrice: item.totalPrice.toString(),
      productImage: item.productImage || null,
      unitValue: item.unitValue || null,
    }));
    await db.insert(orderItems).values(itemsToInsert);

    // Initial status history entry
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId,
      status: 'Order Placed',
      comment: `Order received via Shree Seva Web App (${data.deliveryType === 'home_delivery' ? 'Home Delivery' : 'Store Pickup'})`,
      changedBy: 'system',
    });

    // Create delivery record if home delivery
    if (data.deliveryType === 'home_delivery') {
      await db.insert(deliveries).values({
        id: crypto.randomUUID(),
        orderId,
        status: 'assigned',
        estimatedTime: 'Within 2-4 hours',
      });
    }

    // Record payment entry
    await db.insert(payments).values({
      id: crypto.randomUUID(),
      orderId,
      paymentMethod: data.paymentMethod,
      amount: data.totalAmount.toString(),
      status: data.paymentMethod === 'cod' || data.paymentMethod === 'counter' ? 'pending' : 'successful',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId,
        orderNumber,
        totalAmount: data.totalAmount,
        deliveryType: data.deliveryType,
        placedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// GET /api/orders/track/:orderNumber - Track an order by order number or ID
ordersRouter.get('/track/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req.params;

    // Search by orderNumber or ID
    const order = await db.query.orders.findFirst({
      where: (table, { or, eq }) =>
        or(eq(table.orderNumber, orderNumber), eq(table.id, orderNumber)),
      with: {
        items: true,
        statusHistory: true,
        delivery: {
          with: {
            personnel: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ success: false, message: 'Failed to track order' });
  }
});

// GET /api/orders - List recent orders
ordersRouter.get('/', async (req, res) => {
  try {
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
    const recentOrders = await db.query.orders.findMany({
      limit,
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
        statusHistory: true,
      },
    });

    res.json({
      success: true,
      count: recentOrders.length,
      data: recentOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

