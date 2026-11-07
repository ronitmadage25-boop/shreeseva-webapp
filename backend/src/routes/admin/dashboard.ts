import { Router } from 'express';
import { db } from '../../db/index.js';
import { orders, products, inventory, users, categories } from '../../db/schema/index.js';
import { eq, desc, sql, and, lte } from 'drizzle-orm';
import { verifyAdmin } from '../../middleware/auth.js';

export const adminDashboardRouter = Router();

adminDashboardRouter.use(verifyAdmin);

// GET /api/admin/dashboard/summary
adminDashboardRouter.get('/summary', async (_req, res) => {
  try {
    // 1. Total revenue from non-cancelled orders
    const revenueResult = await db.execute(sql`
      SELECT 
        COALESCE(SUM(CAST("total_amount" AS NUMERIC)), 0) as "total_revenue",
        COUNT("id") as "total_orders",
        COUNT(CASE WHEN "order_status" = 'delivered' THEN 1 END) as "completed_orders",
        COUNT(CASE WHEN "order_status" IN ('placed', 'confirmed', 'packed', 'out_for_delivery') THEN 1 END) as "pending_orders"
      FROM "orders"
      WHERE "order_status" != 'cancelled';
    `);

    const stats = revenueResult.rows[0] as any;
    const totalRevenue = parseFloat(stats.total_revenue || '0');
    const totalOrders = parseInt(stats.total_orders || '0', 10);
    const completedOrders = parseInt(stats.completed_orders || '0', 10);
    const pendingOrders = parseInt(stats.pending_orders || '0', 10);
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 2. Total registered customers
    const customersResult = await db.execute(sql`
      SELECT COUNT("id") as "total_customers"
      FROM "users"
      WHERE "role" = 'customer';
    `);
    const totalCustomers = parseInt((customersResult.rows[0] as any).total_customers || '0', 10);

    // 3. Products in stock & low stock count
    const inventoryResult = await db.execute(sql`
      SELECT 
        COUNT(CASE WHEN "stock_quantity" > 0 AND "is_available" = true THEN 1 END) as "in_stock_products",
        COUNT(CASE WHEN "stock_quantity" <= "low_stock_threshold" THEN 1 END) as "low_stock_products"
      FROM "inventory";
    `);
    const invStats = inventoryResult.rows[0] as any;
    const inStockProducts = parseInt(invStats.in_stock_products || '0', 10);
    const lowStockProducts = parseInt(invStats.low_stock_products || '0', 10);

    // 4. Recent orders (latest 6)
    const recentOrders = await db.query.orders.findMany({
      limit: 6,
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
      },
    });

    // 5. Low stock alerts (items where stock <= lowStockThreshold)
    const lowStockItems = await db.query.inventory.findMany({
      where: (inv, { lte }) => lte(inv.stockQuantity, inv.lowStockThreshold),
      limit: 6,
      with: {
        product: {
          with: {
            category: true,
          },
        },
      },
    });

    // 6. Sales breakdown by delivery type
    const deliveryBreakdown = await db.execute(sql`
      SELECT 
        "delivery_type",
        COUNT("id") as "count",
        COALESCE(SUM(CAST("total_amount" AS NUMERIC)), 0) as "revenue"
      FROM "orders"
      WHERE "order_status" != 'cancelled'
      GROUP BY "delivery_type";
    `);

    res.json({
      success: true,
      data: {
        kpi: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          averageOrderValue: aov,
          pendingOrders,
          completedOrders,
          inStockProducts,
          lowStockProducts,
        },
        recentOrders,
        lowStockItems,
        deliveryBreakdown: deliveryBreakdown.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard summary:', error);
    res.status(500).json({ success: false, message: 'Failed to load dashboard summary.' });
  }
});

