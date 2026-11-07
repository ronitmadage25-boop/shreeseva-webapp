import { Router } from 'express';
import { db } from '../../db/index.js';
import { users, adminActivityLogs } from '../../db/schema/index.js';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { JWT_SECRET, verifyAdmin, AuthenticatedRequest } from '../../middleware/auth.js';

export const adminAuthRouter = Router();

// In-memory rate limiter for login attempts (5 attempts per IP per 15 minutes)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

// POST /api/admin/auth/login
adminAuthRouter.post('/login', async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    // Check rate limit
    const attempt = loginAttempts.get(ip);
    if (attempt) {
      if (now - attempt.firstAttempt < ATTEMPT_WINDOW_MS) {
        if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
          const remainingMinutes = Math.ceil((ATTEMPT_WINDOW_MS - (now - attempt.firstAttempt)) / 60000);
          return res.status(429).json({
            success: false,
            message: `Too many failed login attempts. Please wait ${remainingMinutes} minutes before trying again.`,
          });
        }
      } else {
        loginAttempts.delete(ip);
      }
    }

    const { username, password, rememberMe } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    // Find owner/admin user by username, email, or phone
    const user = await db.query.users.findFirst({
      where: or(
        eq(users.username, username.trim()),
        eq(users.email, username.trim().toLowerCase()),
        eq(users.phone, username.trim())
      ),
    });

    if (!user || !user.passwordHash || (user.role !== 'owner' && user.role !== 'admin')) {
      const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
      record.count += 1;
      loginAttempts.set(ip, record);

      return res.status(401).json({
        success: false,
        message: 'Invalid owner username or password.',
      });
    }

    // Verify bcrypt password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const record = loginAttempts.get(ip) || { count: 0, firstAttempt: now };
      record.count += 1;
      loginAttempts.set(ip, record);

      return res.status(401).json({
        success: false,
        message: 'Invalid owner username or password.',
      });
    }

    // Reset rate limit on success
    loginAttempts.delete(ip);

    // Sign JWT
    const expiresIn = rememberMe ? '30d' : '24h';
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username || 'admin',
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn }
    );

    // Set secure HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    res.cookie('shree_seva_admin_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge,
    });

    // Record login activity in database
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: user.id,
      action: 'LOGIN',
      details: `Owner logged in from IP ${ip}`,
      ipAddress: ip,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      token, // Also return token for clients using Authorization header
      admin: {
        id: user.id,
        username: user.username || 'admin',
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isTemporaryPassword: user.isTemporaryPassword,
      },
    });
  } catch (error: any) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Internal authentication error occurred.',
      detail: process.env.DATABASE_URL ? undefined : 'DATABASE_URL is missing in environment variables.',
    });
  }
});

// GET /api/admin/auth/me - Verify current session
adminAuthRouter.get('/me', verifyAdmin, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    admin: req.admin,
  });
});

// POST /api/admin/auth/change-password - Change temporary or existing password
adminAuthRouter.post('/change-password', verifyAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const adminId = req.admin!.id;
    const user = await db.query.users.findFirst({
      where: eq(users.id, adminId),
    });

    if (!user || !user.passwordHash) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // If current password provided, verify it
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await db
      .update(users)
      .set({
        passwordHash: newHash,
        isTemporaryPassword: false,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, adminId));

    // Audit log
    await db.insert(adminActivityLogs).values({
      id: crypto.randomUUID(),
      userId: adminId,
      action: 'PASSWORD_CHANGE',
      details: 'Owner updated password and cleared temporary status',
      ipAddress: req.ip || 'unknown',
    });

    res.json({
      success: true,
      message: 'Password successfully changed. Temporary status removed.',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
});

// POST /api/admin/auth/logout
adminAuthRouter.post('/logout', verifyAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    if (req.admin) {
      await db.insert(adminActivityLogs).values({
        id: crypto.randomUUID(),
        userId: req.admin.id,
        action: 'LOGOUT',
        details: 'Owner logged out from dashboard',
        ipAddress: req.ip || 'unknown',
      });
    }

    res.clearCookie('shree_seva_admin_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to logout cleanly.' });
  }
});

