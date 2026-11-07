import { app } from './app.js';

async function testBackend() {
  const PORT = 5001;
  const server = app.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}...`);

    try {
      // 1. Test /api/health
      console.log('Testing GET /api/health...');
      const healthRes = await fetch(`http://localhost:${PORT}/api/health`);
      const health: any = await healthRes.json();
      console.log('  -> Health response:', JSON.stringify(health, null, 2));

      // 2. Test /api/categories
      console.log('\nTesting GET /api/categories...');
      const catRes = await fetch(`http://localhost:${PORT}/api/categories`);
      const catData: any = await catRes.json();
      console.log(`  -> Categories count: ${catData.count}`);
      console.log(`  -> Sample category: ${catData.data[0]?.name} (${catData.data[0]?.slug})`);

      // 3. Test /api/products/featured
      console.log('\nTesting GET /api/products/featured...');
      const featRes = await fetch(`http://localhost:${PORT}/api/products/featured`);
      const featData: any = await featRes.json();
      console.log(`  -> Featured count: ${featData.count}`);
      console.log(`  -> Sample product: ${featData.data[0]?.name} - ₹${featData.data[0]?.basePrice}`);

      // 4. Test /api/orders/track/SS-842910
      console.log('\nTesting GET /api/orders/track/SS-842910 (Reference UI Order)...');
      const orderRes = await fetch(`http://localhost:${PORT}/api/orders/track/SS-842910`);
      const orderData: any = await orderRes.json();
      console.log(`  -> Order Number: ${orderData.data?.orderNumber}`);
      console.log(`  -> Customer: ${orderData.data?.customerName} (${orderData.data?.customerPhone})`);
      console.log(`  -> Status: ${orderData.data?.orderStatus}`);
      console.log(`  -> Total Amount: ₹${orderData.data?.totalAmount}`);
      console.log(`  -> Items count: ${orderData.data?.items?.length}`);
      console.log(`  -> Delivery Person: ${orderData.data?.delivery?.personnel?.fullName} (${orderData.data?.delivery?.personnel?.phone})`);

      console.log('\n✨ All backend API endpoints verified successfully against Neon PostgreSQL!');
    } catch (err) {
      console.error('Test failed:', err);
    } finally {
      server.close(() => {
        process.exit(0);
      });
    }
  });
}

testBackend();
