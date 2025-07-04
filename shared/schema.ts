import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.date(),
});

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['user', 'admin']).default('user'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  imageUrl: z.string(),
  stock: z.number(),
  sku: z.string(),
  status: z.enum(['active', 'inactive']).default('active'),
  createdAt: z.date(),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  imageUrl: z.string().url(),
  stock: z.number().min(0),
  sku: z.string().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Cart schema
export const cartItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  createdAt: z.date(),
});

export const insertCartItemSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
    name: z.string(),
  })),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending'),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  paymentIntentId: z.string().optional(),
  createdAt: z.date(),
});

export const insertOrderSchema = z.object({
  userId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number(),
    price: z.number(),
    name: z.string(),
  })),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
  }),
  paymentIntentId: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
