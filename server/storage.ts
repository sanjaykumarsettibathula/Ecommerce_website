import { users, products, cartItems, orders, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "@shared/schema";
import 'dotenv/config';

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

  // Wishlist methods
  addToWishlist(userId: number, productId: number): Promise<boolean>;
  removeFromWishlist(userId: number, productId: number): Promise<boolean>;
  getWishlistByUserId(userId: number): Promise<Product[]>;
  isProductInWishlist(userId: number, productId: number): Promise<boolean>;
}

// Seed some initial products with INR prices and multiple categories
export const initialProducts: InsertProduct[] = [
  // Electronics Category
  {
    name: "Premium Wireless Headphones",
    description: "High-quality sound with noise cancellation",
    price: "15999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    stock: 45,
    sku: "WH-001",
    status: "active"
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health and fitness goals",
    price: "24999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    stock: 12,
    sku: "SW-002",
    status: "active"
  },
  {
    name: "Ultra-Thin Laptop",
    description: "Powerful performance in a sleek design",
    price: "89999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    stock: 8,
    sku: "LT-003",
    status: "active"
  },
  {
    name: "Professional Camera",
    description: "Capture memories in stunning detail",
    price: "74999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    stock: 15,
    sku: "CAM-004",
    status: "active"
  },
  {
    name: "Pro Tablet",
    description: "Perfect for work and entertainment",
    price: "44999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    stock: 25,
    sku: "TAB-005",
    status: "active"
  },
  {
    name: "Mechanical Keyboard",
    description: "Premium typing experience",
    price: "12999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
    stock: 30,
    sku: "KB-006",
    status: "active"
  },
  {
    name: "4K Monitor",
    description: "Crystal clear display quality",
    price: "32999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
    stock: 18,
    sku: "MON-007",
    status: "active"
  },
  {
    name: "Wireless Earbuds",
    description: "Compact and powerful audio",
    price: "11999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop",
    stock: 50,
    sku: "EB-008",
    status: "active"
  },
  {
    name: "Gaming Mouse",
    description: "Precision for gaming and work",
    price: "5999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    stock: 40,
    sku: "GM-009",
    status: "active"
  },
  {
    name: "Smartphone",
    description: "Latest technology in your pocket",
    price: "54999.00",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    stock: 22,
    sku: "SP-010",
    status: "active"
  },
  
  // Clothing Category
  {
    name: "Cotton T-Shirt",
    description: "Soft and comfortable casual wear",
    price: "899.00",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    stock: 100,
    sku: "TS-001",
    status: "active"
  },
  {
    name: "Denim Jeans",
    description: "Classic blue denim jeans",
    price: "2499.00",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
    stock: 75,
    sku: "DJ-002",
    status: "active"
  },
  {
    name: "Formal Shirt",
    description: "Professional office wear",
    price: "1899.00",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop",
    stock: 60,
    sku: "FS-003",
    status: "active"
  },
  {
    name: "Winter Jacket",
    description: "Warm and stylish winter wear",
    price: "3999.00",
    category: "Clothing",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    stock: 30,
    sku: "WJ-004",
    status: "active"
  },
  
  // Books Category
  {
    name: "Programming Fundamentals",
    description: "Learn the basics of programming",
    price: "599.00",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    stock: 50,
    sku: "BK-001",
    status: "active"
  },
  {
    name: "Business Strategy",
    description: "Master the art of business planning",
    price: "799.00",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    stock: 25,
    sku: "BK-002",
    status: "active"
  },
  {
    name: "Fiction Novel",
    description: "Engaging story for your leisure time",
    price: "399.00",
    category: "Books",
    imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop",
    stock: 80,
    sku: "BK-003",
    status: "active"
  },
  
  // Home & Garden Category
  {
    name: "Coffee Maker",
    description: "Start your day with perfect coffee",
    price: "3999.00",
    category: "Home & Garden",
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
    stock: 20,
    sku: "HG-001",
    status: "active"
  },
  {
    name: "Garden Plant Pot",
    description: "Beautiful ceramic plant pot",
    price: "899.00",
    category: "Home & Garden",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    stock: 40,
    sku: "HG-002",
    status: "active"
  },
  {
    name: "LED Desk Lamp",
    description: "Modern lighting for your workspace",
    price: "1499.00",
    category: "Home & Garden",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
    stock: 35,
    sku: "HG-003",
    status: "active"
  },
  
  // Sports & Fitness Category
  {
    name: "Yoga Mat",
    description: "Comfortable and durable yoga mat",
    price: "1299.00",
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    stock: 60,
    sku: "SF-001",
    status: "active"
  },
  {
    name: "Dumbbells Set",
    description: "Complete home workout equipment",
    price: "2999.00",
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    stock: 25,
    sku: "SF-002",
    status: "active"
  },
  {
    name: "Running Shoes",
    description: "Comfortable shoes for your runs",
    price: "3499.00",
    category: "Sports & Fitness",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
    stock: 45,
    sku: "SF-003",
    status: "active"
  }
];

class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private orders: Map<string, Order> = new Map();
  private wishlist: Map<string, { userId: number; productId: number; createdAt: Date }> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create initial products
    initialProducts.forEach(product => {
      this.createProduct(product);
    });

    // Create admin user
    this.createUser({
      email: "admin@shopcraft.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const
    });
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.users.size + 1, // Use numeric ID to match database
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: (userData.role || "user") as "user" | "admin",
      createdAt: new Date(),
    };
    this.users.set(user.id.toString(), user);
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.get(id.toString()) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const user = this.users.get(id.toString());
    if (!user) return null;

    const updatedUser = { ...user, ...userData };
    this.users.set(id.toString(), updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id.toString());
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Product methods
  async createProduct(productData: InsertProduct): Promise<Product> {
    const dbProduct = {
      id: this.products.size + 1,
      name: productData.name,
      description: productData.description,
      price: String(productData.price),
      category: productData.category,
      imageUrl: productData.imageUrl,
      stock: productData.stock || 0,
      sku: productData.sku,
      status: (productData.status || "active") as "active" | "inactive",
      createdAt: new Date(),
    };
    this.products.set(dbProduct.id.toString(), dbProduct as Product);
    // Return as Product with price as number
    return { ...dbProduct, price: Number(dbProduct.price) } as any;
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = this.products.get(id.toString());
    if (!product) return null;
    return { ...product, price: Number(product.price) } as any;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).map(product => ({ ...product, price: Number(product.price) } as any));
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    const product = this.products.get(id.toString());
    if (!product) return null;
    // Update DB storage as string
    const updatedDbProduct = { ...product, ...productData };
    if (productData.price !== undefined) {
      updatedDbProduct.price = String(productData.price);
    }
    this.products.set(id.toString(), updatedDbProduct as Product);
    // Return as number
    return { ...updatedDbProduct, price: Number(updatedDbProduct.price) } as any;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id.toString());
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.toLowerCase();
    const products = Array.from(this.products.values());
    return products
      .filter(product => 
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      )
      .map(product => ({ ...product, price: Number(product.price) } as any));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = Array.from(this.products.values());
    return products
      .filter(product => product.category === category)
      .map(product => ({ ...product, price: Number(product.price) } as any));
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
      this.cartItems.set(existingItem.id.toString(), existingItem);
      return existingItem;
    }

    const cartItem: CartItem = {
      id: this.cartItems.size + 1, // Use numeric ID to match database
      ...cartItemData,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id.toString(), cartItem);
    return cartItem;
  }

  async getCartByUserId(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | null> {
    const cartItem = this.cartItems.get(id.toString());
    if (!cartItem) return null;

    cartItem.quantity = quantity;
    this.cartItems.set(id.toString(), cartItem);
    return cartItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id.toString());
  }

  async clearCart(userId: number): Promise<boolean> {
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
      id: this.orders.size + 1, // Use numeric ID to match database
      userId: orderData.userId,
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      status: (orderData.status || "pending") as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
      shippingAddress: orderData.shippingAddress,
      paymentIntentId: orderData.paymentIntentId || null,
      createdAt: new Date(),
    };
    this.orders.set(order.id.toString(), order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orders.get(id.toString()) || null;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order | null> {
    const order = this.orders.get(id.toString());
    if (!order) return null;

    order.status = status;
    this.orders.set(id.toString(), order);
    return order;
  }

  // Wishlist methods
  async addToWishlist(userId: number, productId: number): Promise<boolean> {
    const key = `${userId}:${productId}`;
    if (this.wishlist.has(key)) return false;
    this.wishlist.set(key, { userId, productId, createdAt: new Date() });
    return true;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const key = `${userId}:${productId}`;
    return this.wishlist.delete(key);
  }

  async getWishlistByUserId(userId: number): Promise<Product[]> {
    const productIds = Array.from(this.wishlist.values())
      .filter(item => item.userId === userId)
      .map(item => item.productId.toString());
    return productIds.map(pid => this.products.get(pid)).filter(Boolean) as Product[];
  }

  async isProductInWishlist(userId: number, productId: number): Promise<boolean> {
    const key = `${userId}:${productId}`;
    return this.wishlist.has(key);
  }
}

import { DatabaseStorage } from "./database-storage";

export const storage = new DatabaseStorage();
