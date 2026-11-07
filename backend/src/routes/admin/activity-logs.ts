import { Router } from 'express';
import { db } from '../../db/index.js';
import { adminActivityLogs } from '../../db/schema/index.js';
import { desc } from 'drizzle-orm';
import { verifyAdmin } from '../../middleware/auth.js';

export const adminActivityLogsRouter = Router();

adminActivityLogsRouter.use(verifyAdmin);

// GET /api/admin/activity-logs - List audit trail of owner/admin actions
adminActivityLogsRouter.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 50));
    const offset = (page - 1) * limit;

    const logs = await db.query.adminActivityLogs.findMany({
      limit,
      offset,
      orderBy: [desc(adminActivityLogs.createdAt)],
      with: {
        user: true,
      },
    });

    res.json({
      success: true,
      page,
      limit,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs.' });
  }
});

