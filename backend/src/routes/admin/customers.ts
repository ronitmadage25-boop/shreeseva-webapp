import { Router } from 'express';
import { db } from '../../db/index.js';
import { users, orders, addresses } from '../../db/schema/index.js';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { verifyAdmin } from '../../middleware/auth.js';

export const adminCustomersRouter = Router();

adminCustomersRouter.use(verifyAdmin);

// GET /api/admin/customers - List customers with total orders and total spend
adminCustomersRouter.get('/', async (req, res) => {
  try {
    const search = req.query.search as string | undefined;

    let query = sql`
      SELECT 
        u."id",
        u."full_name" as "fullName",
        u."phone",
        u."email",
        u."created_at" as "createdAt",
        COUNT(o."id") as "totalOrders",
        COALESCE(SUM(CASE WHEN o."order_status" = 'delivered' THEN CAST(o."total_amount" AS NUMERIC) ELSE 0 END), 0) as "totalSpent",
        MAX(o."created_at") as "lastOrderDate"
      FROM "users" u
      LEFT JOIN "orders" o ON o."user_id" = u."id"
      WHERE u."role" = 'customer'
    `;

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      query = sql`${query} AND (u."full_name" ILIKE ${q} OR u."phone" ILIKE ${q} OR u."email" ILIKE ${q})`;
    }

    query = sql`${query} GROUP BY u."id", u."full_name", u."phone", u."email", u."created_at" ORDER BY "totalSpent" DESC;`;

    const result = await db.execute(query);

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer data.' });
  }
});

// GET /api/admin/customers/:id - Single customer details with addresses and order history
adminCustomersRouter.get('/:id', async (req, res) => {
  try {
    const id = req.params.id as string;
    const customer = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        addresses: true,
        orders: {
          orderBy: [desc(orders.createdAt)],
          with: {
            items: true,
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    // Never return password hash or security fields
    const { passwordHash, ...safeCustomer } = customer as any;

    res.json({
      success: true,
      data: safeCustomer,
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer details.' });
  }
});
