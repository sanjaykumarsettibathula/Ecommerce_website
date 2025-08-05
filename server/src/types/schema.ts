import { z } from "zod";
import { pgTable, text, integer, timestamp, decimal, jsonb, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// Database Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  role: text('role').$type<'user' | 'admin'>().default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types and schemas
export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof loginSchema>;

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull().default(0),
  sku: text('sku').notNull().unique(),
  status: text('status').$type<'active' | 'inactive'>().default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, createdAt: true });
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  items: jsonb('items').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull(),
  shipping: decimal('shipping', { precision: 10, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').$type<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>().default('pending').notNull(),
  shippingAddress: jsonb('shipping_address').notNull(),
  paymentIntentId: text('payment_intent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type WishlistItem = typeof wishlist.$inferSelect;
export const insertWishlistItemSchema = createInsertSchema(wishlist).omit({ id: true, createdAt: true });
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

// Frontend type definitions for consistency
export interface FrontendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
}

export interface FrontendCartItem {
  id: number;
  productId: number;
  quantity: number;
  product: FrontendProduct;
}

export interface FrontendUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
  wishlist: many(wishlist),
}));

export const productsRelations = relations(products, ({ many }) => ({
  cartItems: many(cartItems),
  wishlist: many(wishlist),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, { fields: [wishlist.userId], references: [users.id] }),
  product: one(products, { fields: [wishlist.productId], references: [products.id] }),
}));
