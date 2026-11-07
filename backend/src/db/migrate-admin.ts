import { db } from './index.js';
import { sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function runAdminMigrations() {
  console.log('🔄 Running direct schema update for Owner Admin features...');

  // 1. Update users table with admin credentials
  await db.execute(sql`
    ALTER TABLE "users" 
    ADD COLUMN IF NOT EXISTS "username" varchar(50) UNIQUE,
    ADD COLUMN IF NOT EXISTS "password_hash" varchar(255),
    ADD COLUMN IF NOT EXISTS "is_temporary_password" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "password_changed_at" timestamp;
  `);

  // 2. Create inventory_logs table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "inventory_logs" (
      "id" varchar(36) PRIMARY KEY,
      "product_id" varchar(36) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "previous_stock" integer NOT NULL,
      "new_stock" integer NOT NULL,
      "adjustment_quantity" integer NOT NULL,
      "reason" varchar(255) NOT NULL,
      "actor_id" varchar(36) REFERENCES "users"("id") ON DELETE SET NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `);

  // 3. Create offers table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "offers" (
      "id" varchar(36) PRIMARY KEY,
      "code" varchar(50) NOT NULL UNIQUE,
      "title" varchar(255) NOT NULL,
      "description" text,
      "discount_type" varchar(20) DEFAULT 'percentage' NOT NULL,
      "discount_value" numeric(10, 2) NOT NULL,
      "min_order_value" numeric(10, 2) DEFAULT '0' NOT NULL,
      "max_discount" numeric(10, 2),
      "start_date" timestamp,
      "expiry_date" timestamp,
      "usage_limit" integer,
      "usage_count" integer DEFAULT 0 NOT NULL,
      "is_active" boolean DEFAULT true NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `);

  // 4. Create store_settings table if not exists
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "store_settings" (
      "id" varchar(36) PRIMARY KEY,
      "store_name" varchar(255) DEFAULT 'Shree Seva Enterprises & Readymade' NOT NULL,
      "phone" varchar(50) DEFAULT '+91 98765 43210' NOT NULL,
      "email" varchar(255) DEFAULT 'contact@shreeseva.local' NOT NULL,
      "address" text DEFAULT 'Station Road, Opp. Primary School, Pachora, Maharashtra 424201' NOT NULL,
      "operating_hours" varchar(100) DEFAULT '8:00 AM - 9:30 PM (Daily)' NOT NULL,
      "delivery_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
      "min_order_value" numeric(10, 2) DEFAULT '0' NOT NULL,
      "low_stock_threshold" integer DEFAULT 10 NOT NULL,
      "timezone" varchar(50) DEFAULT 'Asia/Kolkata' NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `);

  // 5. Seed initial store settings if empty
  await db.execute(sql`
    INSERT INTO "store_settings" (
      "id", "store_name", "phone", "email", "address", "operating_hours", "delivery_fee", "min_order_value", "low_stock_threshold", "timezone", "updated_at"
    ) VALUES (
      'setting-default',
      'Shree Seva Enterprises & Readymade',
      '+91 98765 43210',
      'contact@shreeseva.local',
      'Station Road, Opp. Primary School, Pachora, Maharashtra 424201',
      '8:00 AM - 9:30 PM (Daily)',
      '0.00',
      '0.00',
      10,
      'Asia/Kolkata',
      now()
    ) ON CONFLICT ("id") DO NOTHING;
  `);

  // 6. Provision owner admin account with bcrypt hash
  // Requirement: Username: admin, Temporary password: admin@2006, isTemporaryPassword: true
  const tempPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin@2006';
  const adminUsername = process.env.ADMIN_INITIAL_USERNAME || 'admin';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(tempPassword, salt);

  // Check if owner user already exists
  const existingOwner = await db.execute(sql`
    SELECT "id" FROM "users" WHERE "phone" = '+919800011122' OR "id" = 'usr-owner' OR "username" = ${adminUsername} LIMIT 1;
  `);

  if (existingOwner.rows && existingOwner.rows.length > 0) {
    await db.execute(sql`
      UPDATE "users"
      SET "username" = ${adminUsername},
          "role" = 'owner',
          "password_hash" = ${passwordHash},
          "is_temporary_password" = true,
          "updated_at" = now()
      WHERE "id" = ${existingOwner.rows[0].id};
    `);
  } else {
    await db.execute(sql`
      INSERT INTO "users" (
        "id", "phone", "full_name", "email", "role", "username", "password_hash", "is_temporary_password", "created_at", "updated_at"
      ) VALUES (
        'usr-owner',
        '+919800011122',
        'Shree Seva Store Owner',
        'owner@shreeseva.local',
        'owner',
        ${adminUsername},
        ${passwordHash},
        true,
        now(),
        now()
      );
    `);
  }

  // 7. Seed sample initial offer/coupon
  await db.execute(sql`
    INSERT INTO "offers" (
      "id", "code", "title", "description", "discount_type", "discount_value", "min_order_value", "max_discount", "is_active", "created_at", "updated_at"
    ) VALUES (
      'off-welcome10',
      'SHREE10',
      'Flat 10% Off on Kirana',
      'Get 10% instant discount on daily grocery essentials over ₹500 in Pachora',
      'percentage',
      '10.00',
      '500.00',
      '100.00',
      true,
      now(),
      now()
    ) ON CONFLICT ("code") DO NOTHING;
  `);

  console.log('✅ Admin migration & owner provisioning completed successfully!');
}

runAdminMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
