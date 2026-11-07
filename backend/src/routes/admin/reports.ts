import { Router } from 'express';
import { db } from '../../db/index.js';
import { orders, products, users } from '../../db/schema/index.js';
import { desc, sql } from 'drizzle-orm';
import { verifyAdmin } from '../../middleware/auth.js';

export const adminReportsRouter = Router();

adminReportsRouter.use(verifyAdmin);

// GET /api/admin/reports/sales/csv - Export sales CSV
adminReportsRouter.get('/sales/csv', async (_req, res) => {
  try {
    const rows = await db.query.orders.findMany({
      orderBy: [desc(orders.createdAt)],
      with: {
        items: true,
      },
    });

    let csv = 'Order Number,Date,Customer Name,Phone,Delivery Type,Payment Method,Payment Status,Order Status,Items Count,Total Amount\n';
    for (const o of rows) {
      const dateStr = new Date(o.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }).replace(/,/g, '');
      csv += `"${o.orderNumber}","${dateStr}","${o.customerName}","${o.customerPhone}","${o.deliveryType}","${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}",${o.items.length},"${o.totalAmount}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shree-seva-sales-report-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating sales report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate sales report.' });
  }
});

// GET /api/admin/reports/inventory/csv - Export inventory valuation CSV
adminReportsRouter.get('/inventory/csv', async (_req, res) => {
  try {
    const list = await db.query.products.findMany({
      with: {
        category: true,
        inventory: true,
      },
    });

    let csv = 'Product Name,Category,Brand,Pack Size,Base Price,Discount Price,Stock Quantity,Low Stock Threshold,Stock Status\n';
    for (const p of list) {
      const stock = p.inventory?.stockQuantity ?? 0;
      const threshold = p.inventory?.lowStockThreshold ?? 10;
      const status = stock <= 0 ? 'OUT_OF_STOCK' : stock <= threshold ? 'LOW_STOCK' : 'IN_STOCK';
      csv += `"${p.name.replace(/"/g, '""')}","${p.category.name}","${p.brand}","${p.unitValue}","${p.basePrice}","${p.discountPrice || p.basePrice}",${stock},${threshold},"${status}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shree-seva-inventory-report-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate inventory report.' });
  }
});

// GET /api/admin/reports/customers/csv - Export customer intelligence CSV
adminReportsRouter.get('/customers/csv', async (_req, res) => {
  try {
    const result = await db.execute(sql`
      SELECT 
        u."full_name" as "fullName",
        u."phone",
        u."email",
        TO_CHAR(u."created_at" AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD HH24:MI') as "registeredAt",
        COUNT(o."id") as "totalOrders",
        COALESCE(SUM(CASE WHEN o."order_status" = 'delivered' THEN CAST(o."total_amount" AS NUMERIC) ELSE 0 END), 0) as "totalSpent"
      FROM "users" u
      LEFT JOIN "orders" o ON o."user_id" = u."id"
      WHERE u."role" = 'customer'
      GROUP BY u."id", u."full_name", u."phone", u."email", u."created_at"
      ORDER BY "totalSpent" DESC;
    `);

    let csv = 'Customer Name,Phone,Email,Registration Date,Total Orders,Total Spent (INR)\n';
    for (const c of result.rows as any[]) {
      csv += `"${c.fullName}","${c.phone}","${c.email || ''}","${c.registeredAt}",${c.totalOrders},"${c.totalSpent}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="shree-seva-customers-report-${Date.now()}.csv"`);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating customer report:', error);
    res.status(500).json({ success: false, message: 'Failed to generate customer report.' });
  }
});

