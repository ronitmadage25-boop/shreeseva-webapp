import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'shree-seva-super-secret-jwt-key-pachora-2026';

export interface AdminPayload {
  userId: string;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    username: string;
    fullName: string;
    email: string | null;
    phone: string;
    role: string;
    isTemporaryPassword: boolean;
  };
}

/**
 * Middleware: Verifies authenticated owner/admin role from HTTP-only cookie or Bearer token
 */
export async function verifyAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.cookies?.shree_seva_admin_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in as store owner.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token.',
      });
    }

    // Verify user in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.',
      });
    }

    if (user.role !== 'owner' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Owner privileges required to access this resource.',
      });
    }

    req.admin = {
      id: user.id,
      username: user.username || 'admin',
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isTemporaryPassword: user.isTemporaryPassword || false,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Session expired or token invalid.',
    });
  }
}

