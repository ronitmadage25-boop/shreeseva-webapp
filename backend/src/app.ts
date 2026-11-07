import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Customer Facing Routers
import { healthRouter } from './routes/health.js';
import { storeRouter } from './routes/store.js';
import { categoriesRouter } from './routes/categories.js';
import { productsRouter } from './routes/products.js';
import { searchRouter } from './routes/search.js';
import { ordersRouter } from './routes/orders.js';

// Owner Admin Routers
import { adminAuthRouter } from './routes/admin/auth.js';
import { adminDashboardRouter } from './routes/admin/dashboard.js';
import { adminAnalyticsRouter } from './routes/admin/analytics.js';
import { adminOrdersRouter } from './routes/admin/orders.js';
import { adminProductsRouter } from './routes/admin/products.js';
import { adminInventoryRouter } from './routes/admin/inventory.js';
import { adminCategoriesRouter } from './routes/admin/categories.js';
import { adminCustomersRouter } from './routes/admin/customers.js';
import { adminDeliveriesRouter } from './routes/admin/deliveries.js';
import { adminOffersRouter } from './routes/admin/offers.js';
import { adminReportsRouter } from './routes/admin/reports.js';
import { adminActivityLogsRouter } from './routes/admin/activity-logs.js';
import { adminSettingsRouter } from './routes/admin/settings.js';

export const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome
app.get('/', (_req, res) => {
  res.json({
    name: 'Shree Seva Enterprises & Readymade API',
    location: 'Pachora, Maharashtra, India',
    version: '1.0.0',
    documentation: 'See /api/health and /api/products',
  });
});

// Mount Public / Customer API routes
app.use('/api/health', healthRouter);
app.use('/api/store', storeRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/orders', ordersRouter);

// Mount Owner Admin API routes
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/dashboard', adminDashboardRouter);
app.use('/api/admin/analytics', adminAnalyticsRouter);
app.use('/api/admin/orders', adminOrdersRouter);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/inventory', adminInventoryRouter);
app.use('/api/admin/categories', adminCategoriesRouter);
app.use('/api/admin/customers', adminCustomersRouter);
app.use('/api/admin/deliveries', adminDeliveriesRouter);
app.use('/api/admin/offers', adminOffersRouter);
app.use('/api/admin/reports', adminReportsRouter);
app.use('/api/admin/activity-logs', adminActivityLogsRouter);
app.use('/api/admin/settings', adminSettingsRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found on Shree Seva API server',
  });
});

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
