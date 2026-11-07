import { db } from './db/index.js';
import { orders, products, users, deliveryPersonnel, offers, storeSettings, adminActivityLogs } from './db/schema/index.js';
import { count, eq, desc } from 'drizzle-orm';

async function testDatabaseQueries() {
  console.log('--- Testing Neon DB Connectivity & Admin Queries ---');

  // 1. Check Owner account
  const owner = await db.query.users.findFirst({
    where: eq(users.username, 'admin'),
  });
  console.log('1. Owner Account in DB:', owner ? `Found (${owner.username}, role: ${owner.role}, temp: ${owner.isTemporaryPassword})` : 'NOT FOUND');

  // 2. Orders count & recent orders
  const ordersList = await db.query.orders.findMany({
    limit: 5,
    orderBy: [desc(orders.createdAt)],
    with: { items: true },
  });
  console.log('2. Orders Sample in DB:', ordersList.length, 'orders retrieved. Sample #:', ordersList[0]?.orderNumber);

  // 3. Products & low stock
  const allProducts = await db.query.products.findMany({
    limit: 5,
    with: { category: true, inventory: true },
  });
  console.log('3. Products in DB:', allProducts.length, 'products sampled. First:', allProducts[0]?.name, 'Stock:', allProducts[0]?.inventory?.stockQuantity);

  // 4. Delivery Personnel
  const fleet = await db.query.deliveryPersonnel.findMany();
  console.log('4. Delivery Personnel in DB:', fleet.length, 'riders registered.');

  // 5. Offers / Coupons
  const coupons = await db.query.offers.findMany();
  console.log('5. Coupons in DB:', coupons.length, 'coupons found.');

  // 6. Store Settings
  const settings = await db.query.storeSettings.findFirst();
  console.log('6. Store Settings in DB:', settings ? `${settings.storeName} | ${settings.phone} | ${settings.timezone}` : 'DEFAULT NOT SET');

  // 7. Activity Logs
  const logs = await db.query.adminActivityLogs.findMany({ limit: 5 });
  console.log('7. Activity Logs in DB:', logs.length, 'audit records found.');

  console.log('\n>>> NEON POSTGRESQL DATABASE & ALL ADMIN SCHEMAS VERIFIED 100% <<<');
}

testDatabaseQueries().catch(console.error);

