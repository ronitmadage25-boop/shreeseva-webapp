import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { healthRouter } from './routes/health.js';
import { storeRouter } from './routes/store.js';
import { categoriesRouter } from './routes/categories.js';
import { productsRouter } from './routes/products.js';
import { searchRouter } from './routes/search.js';
import { ordersRouter } from './routes/orders.js';

export const app = express();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
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

// Mount API routes
app.use('/api/health', healthRouter);
app.use('/api/store', storeRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/search', searchRouter);
app.use('/api/orders', ordersRouter);

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

