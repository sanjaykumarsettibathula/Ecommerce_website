import { users, products, cartItems, orders, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, wishlist } from "./types/schema";
import { db } from "./db";
import { eq, like, and, inArray, or, sql } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      role: (userData.role || "user") as "user" | "admin",
    }).returning();
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user || null;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Product methods
  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values({
      ...productData,
      status: (productData.status || "active") as "active" | "inactive",
    }).returning();
    return product;
  }

  async getProductById(id: number): Promise<Product | null> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    const [product] = await db.update(products).set(productData).where(eq(products.id, id)).returning();
    return product || null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return db.select().from(products).where(
      or(
        sql`LOWER(${products.name}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${products.description}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${products.category}) LIKE ${lowercaseQuery}`,
        sql`LOWER(${products.sku}) LIKE ${lowercaseQuery}`
      )
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }

  // Cart methods
  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db.select().from(cartItems)
      .where(and(eq(cartItems.userId, cartItemData.userId), eq(cartItems.productId, cartItemData.productId)));

    if (existingItem) {
      // Update quantity instead of creating new item
      const [updatedItem] = await db.update(cartItems)
        .set({ quantity: existingItem.quantity + cartItemData.quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    const [cartItem] = await db.insert(cartItems).values(cartItemData).returning();
    return cartItem;
  }

  async getCartByUserId(userId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | null> {
    const [cartItem] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return cartItem || null;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return (result.rowCount ?? 0) >= 0;
  }

  // Order methods
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values({
      ...orderData,
      status: (orderData.status || "pending") as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
    }).returning();
    return order;
  }

  async getOrderById(id: number): Promise<Order | null> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || null;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order | null> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order || null;
  }

  // Wishlist methods
  async addToWishlist(userId: number, productId: number): Promise<boolean> {
    const [existing] = await db.select().from(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    if (existing) return false;
    await db.insert(wishlist).values({ userId, productId }).returning();
    return true;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const result = await db.delete(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getWishlistByUserId(userId: number): Promise<Product[]> {
    const wishlistItems = await db.select().from(wishlist).where(eq(wishlist.userId, userId));
    if (!wishlistItems.length) return [];
    const productIds = wishlistItems.map(item => item.productId);
    if (!productIds.length) return [];
    return db.select().from(products).where(inArray(products.id, productIds));
  }

  async isProductInWishlist(userId: number, productId: number): Promise<boolean> {
    const [existing] = await db.select().from(wishlist).where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    return !!existing;
  }
}