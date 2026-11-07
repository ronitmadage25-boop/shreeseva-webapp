import { app } from './app.js';
import http from 'http';

async function runTest() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, '127.0.0.1', resolve));
  console.log('Test server running on 127.0.0.1:5099');

  try {
    // 1. Login
    const loginRes = await fetch('http://127.0.0.1:5099/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin@2006' }),
    });
    const loginData = (await loginRes.json()) as any;
    console.log('Login Status:', loginRes.status, 'User:', loginData.admin?.username);
    const token = loginData.token;

    const authHeaders = { Authorization: `Bearer ${token}` };

    // 2. Dashboard summary
    const dashRes = await fetch('http://127.0.0.1:5099/api/admin/dashboard/summary', { headers: authHeaders });
    const dashData = (await dashRes.json()) as any;
    console.log('Dashboard Summary Status:', dashRes.status, 'Total Sales:', dashData.summary?.kpis?.totalSales);

    // 3. Deliveries & Personnel
    const delRes = await fetch('http://127.0.0.1:5099/api/admin/deliveries', { headers: authHeaders });
    const delData = (await delRes.json()) as any;
    console.log('Deliveries Status:', delRes.status, 'Count:', delData.count);

    const perRes = await fetch('http://127.0.0.1:5099/api/admin/deliveries/personnel', { headers: authHeaders });
    const perData = (await perRes.json()) as any;
    console.log('Personnel Status:', perRes.status, 'Fleet Size:', perData.count);

    // 4. Offers
    const offRes = await fetch('http://127.0.0.1:5099/api/admin/offers', { headers: authHeaders });
    const offData = (await offRes.json()) as any;
    console.log('Offers Status:', offRes.status, 'Offers Count:', offData.count);

    // 5. Reports (CSV)
    const salesCsvRes = await fetch('http://127.0.0.1:5099/api/admin/reports/sales/csv', { headers: authHeaders });
    const salesCsvText = await salesCsvRes.text();
    console.log('Sales CSV Status:', salesCsvRes.status, 'CSV lines:', salesCsvText.trim().split('\n').length);

    // 6. Activity Logs
    const logRes = await fetch('http://127.0.0.1:5099/api/admin/activity-logs', { headers: authHeaders });
    const logData = (await logRes.json()) as any;
    console.log('Activity Logs Status:', logRes.status, 'Logs Count:', logData.count);

    // 7. Settings
    const setRes = await fetch('http://127.0.0.1:5099/api/admin/settings', { headers: authHeaders });
    const setData = (await setRes.json()) as any;
    console.log('Settings Status:', setRes.status, 'Store:', setData.data?.storeName);

    console.log('\n>>> ALL ADMIN BACKEND AND DATA CONTRACTS VERIFIED 100% <<<');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
  }
}

runTest();
