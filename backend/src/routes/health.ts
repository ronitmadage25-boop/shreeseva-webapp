import { Router } from 'express';
import { db } from '../db/index.js';
import { sql } from 'drizzle-orm';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  let dbStatus = 'disconnected';
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - start;
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
    console.error('Health check database query failed:', error);
  }

  res.json({
    status: 'ok',
    store: 'Shree Seva Enterprises & Readymade',
    location: 'Pachora, Maharashtra, India',
    timestamp: new Date().toISOString(),
    database: {
      provider: 'Neon PostgreSQL (Serverless)',
      status: dbStatus,
      latencyMs: dbLatencyMs,
    },
    version: '1.0.0',
    phase: 'Phase 3 (PWA) + Phase 4 (Backend & Neon DB)',
  });
});

