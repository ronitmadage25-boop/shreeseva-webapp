import {
  pgTable,
  varchar,
  text,
  boolean,
  integer,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table (Single-owner retail store customers & staff)
export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  role: varchar('role', { length: 20 }).notNull().default('customer'), // 'customer' | 'owner' | 'admin' | 'delivery'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Customer Addresses Table
export const addresses = pgTable('addresses', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 50 }).default('Home'), // 'Home' | 'Work' | 'Other'
  recipientName: varchar('recipient_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  addressLine1: varchar('address_line1', { length: 255 }).notNull(),
  addressLine2: varchar('address_line2', { length: 255 }),
  landmark: varchar('landmark', { length: 255 }),
  city: varchar('city', { length: 100 }).notNull().default('Pachora'),
  state: varchar('state', { length: 100 }).notNull().default('Maharashtra'),
  pincode: varchar('pincode', { length: 10 }).notNull().default('424201'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Product Categories Table
export const categories = pgTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Products Table (Daily Kirana, Groceries, Beverages, Stationery, etc.)
export const products = pgTable('products', {
  id: varchar('id', { length: 36 }).primaryKey(),
  categoryId: varchar('category_id', { length: 36 })
    .references(() => categories.id, { onDelete: 'restrict' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  brand: varchar('brand', { length: 100 }).notNull(),
  description: text('description'),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: numeric('discount_price', { precision: 10, scale: 2 }),
  unit: varchar('unit', { length: 20 }).default('pack').notNull(),
  unitValue: varchar('unit_value', { length: 50 }).notNull(), // e.g. '5 kg', '1 L', '200 Pages'
  inStock: boolean('in_stock').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isNewArrival: boolean('is_new_arrival').default(false).notNull(),
  hasOffer: boolean('has_offer').default(false).notNull(),
  rating: numeric('rating', { precision: 3, scale: 2 }).default('4.5'),
  reviewCount: integer('review_count').default(0),
  badge: varchar('badge', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 5. Product Images Table
export const productImages = pgTable('product_images', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 })
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  imageUrl: text('image_url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  isPrimary: boolean('is_primary').default(false).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Inventory Table
export const inventory = pgTable('inventory', {
  id: varchar('id', { length: 36 }).primaryKey(),
  productId: varchar('product_id', { length: 36 })
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  stockQuantity: integer('stock_quantity').default(100).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(10).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 7. Orders Table
export const orders = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(), // e.g. 'SS-842910'
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  deliveryType: varchar('delivery_type', { length: 30 }).default('home_delivery').notNull(), // 'home_delivery' | 'store_pickup'
  deliveryAddress: text('delivery_address'),
  paymentMethod: varchar('payment_method', { length: 30 }).default('cod').notNull(), // 'cod' | 'upi' | 'card' | 'counter'
  paymentStatus: varchar('payment_status', { length: 30 }).default('pending').notNull(), // 'pending' | 'completed' | 'failed' | 'refunded'
  orderStatus: varchar('order_status', { length: 30 }).default('placed').notNull(), // 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled'
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric('delivery_fee', { precision: 10, scale: 2 }).default('0').notNull(),
  discount: numeric('discount', { precision: 10, scale: 2 }).default('0').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  notes: text('notes'),
  placedAt: timestamp('placed_at').defaultNow().notNull(),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Order Items Table
export const orderItems = pgTable('order_items', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: varchar('product_id', { length: 36 }).references(() => products.id, { onDelete: 'set null' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  productImage: text('product_image'),
  unitValue: varchar('unit_value', { length: 50 }),
});

// 9. Order Status History Table
export const orderStatusHistory = pgTable('order_status_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  comment: text('comment'),
  changedBy: varchar('changed_by', { length: 100 }).default('system'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Delivery Personnel Table
export const deliveryPersonnel = pgTable('delivery_personnel', {
  id: varchar('id', { length: 36 }).primaryKey(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  vehicleType: varchar('vehicle_type', { length: 50 }).default('Motorcycle'),
  vehicleNumber: varchar('vehicle_number', { length: 50 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 11. Deliveries Table
export const deliveries = pgTable('deliveries', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  personnelId: varchar('personnel_id', { length: 36 }).references(() => deliveryPersonnel.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).default('assigned'), // 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  estimatedTime: varchar('estimated_time', { length: 50 }),
  actualDeliveryTime: timestamp('actual_delivery_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 12. Payments Table
export const payments = pgTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  transactionId: varchar('transaction_id', { length: 100 }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  status: varchar('status', { length: 30 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. Admin Activity Logs Table
export const adminActivityLogs = pgTable('admin_activity_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// =================== RELATIONS ===================
export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  activityLogs: many(adminActivityLogs),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  inventory: one(inventory, {
    fields: [products.id],
    references: [inventory.productId],
  }),
  orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  delivery: one(deliveries, {
    fields: [orders.id],
    references: [deliveries.orderId],
  }),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const orderStatusHistoryRelations = relations(orderStatusHistory, ({ one }) => ({
  order: one(orders, {
    fields: [orderStatusHistory.orderId],
    references: [orders.id],
  }),
}));

export const deliveryPersonnelRelations = relations(deliveryPersonnel, ({ many }) => ({
  deliveries: many(deliveries),
}));

export const deliveriesRelations = relations(deliveries, ({ one }) => ({
  order: one(orders, {
    fields: [deliveries.orderId],
    references: [orders.id],
  }),
  personnel: one(deliveryPersonnel, {
    fields: [deliveries.personnelId],
    references: [deliveryPersonnel.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

