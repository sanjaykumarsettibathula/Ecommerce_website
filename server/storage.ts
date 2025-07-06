import { nanoid } from "nanoid";
import { users, products, cartItems, orders, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq, like, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: number, user: Partial<User>): Promise<User | null>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Product methods
  createProduct(product: InsertProduct): Promise<Product>;
  getProductById(id: number): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;

  // Cart methods
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  getCartByUserId(userId: number): Promise<CartItem[]>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | null>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;

  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: number): Promise<Order | null>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: number, status: Order['status']): Promise<Order | null>;
}

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial products
    const initialProducts: InsertProduct[] = [
      {
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: 199.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        stock: 45,
        sku: "WH-001",
        status: "active"
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: 299.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        stock: 12,
        sku: "SW-002",
        status: "active"
      },
      {
        name: "Ultra-Thin Laptop",
        description: "Powerful performance in a sleek design",
        price: 1299.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        stock: 8,
        sku: "LT-003",
        status: "active"
      },
      {
        name: "Professional Camera",
        description: "Capture memories in stunning detail",
        price: 899.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
        stock: 15,
        sku: "CAM-004",
        status: "active"
      },
      {
        name: "Pro Tablet",
        description: "Perfect for work and entertainment",
        price: 599.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        stock: 25,
        sku: "TAB-005",
        status: "active"
      },
      {
        name: "Mechanical Keyboard",
        description: "Premium typing experience",
        price: 159.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
        stock: 30,
        sku: "KB-006",
        status: "active"
      },
      {
        name: "4K Monitor",
        description: "Crystal clear display quality",
        price: 399.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
        stock: 18,
        sku: "MON-007",
        status: "active"
      },
      {
        name: "Wireless Earbuds",
        description: "Compact and powerful audio",
        price: 149.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop",
        stock: 50,
        sku: "EB-008",
        status: "active"
      },
      {
        name: "Gaming Mouse",
        description: "Precision for gaming and work",
        price: 79.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        stock: 40,
        sku: "GM-009",
        status: "active"
      },
      {
        name: "Smartphone",
        description: "Latest technology in your pocket",
        price: 699.99,
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        stock: 22,
        sku: "SP-010",
        status: "active"
      }
    ];

    initialProducts.forEach(product => {
      this.createProduct(product);
    });

    // Create admin user
    this.createUser({
      email: "admin@shopcraft.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product methods
  async createProduct(productData: InsertProduct): Promise<Product> {
    const product: Product = {
      id: nanoid(),
      ...productData,
      createdAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id);
    if (!product) return null;

    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products.filter(product => product.category === category);
  }

  // Cart methods
  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.userId === cartItemData.userId && item.productId === cartItemData.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += cartItemData.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const cartItem: CartItem = {
      id: nanoid(),
      ...cartItemData,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async getCartByUserId(userId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return null;

    cartItem.quantity = quantity;
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<boolean> {
    const userCartItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.userId === userId
    );

    userCartItems.forEach(([id]) => {
      this.cartItems.delete(id);
    });

    return true;
  }

  // Order methods
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order: Order = {
      id: nanoid(),
      ...orderData,
      createdAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orders.get(id) || null;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.get(id);
    if (!order) return null;

    order.status = status;
    this.orders.set(id, order);
    return order;
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
