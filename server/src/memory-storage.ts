import { type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder } from "./types/schema";
import type { IStorage } from "./storage";
import { initialProducts } from "./storage";
import bcrypt from "bcrypt";

// In-memory storage for development purposes
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private products: Product[] = [];
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private wishlistItems: { userId: number; productId: number }[] = [];
  private nextIds = {
    user: 1,
    product: 1,
    cartItem: 1,
    order: 1,
  };

  constructor() {
    // Initialize with some data
    this.seedInitialData();
  }

  private async seedInitialData() {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    this.users.push({
      id: this.nextIds.user++,
      email: 'admin@shopcraft.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add initial products
    for (const product of initialProducts) {
      this.products.push({
        id: this.nextIds.product++,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl || '',
        stock: product.stock || 10,
        sku: product.sku || `PROD-${this.nextIds.product}`,
        status: product.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // User methods
  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextIds.user++,
      ...userData,
      role: (userData.role || "user") as "user" | "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    return initialLength > this.users.length;
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  // Product methods
  async createProduct(productData: InsertProduct): Promise<Product> {
    const product: Product = {
      id: this.nextIds.product++,
      ...productData,
      status: (productData.status || "active") as "active" | "inactive",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex(product => product.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...productData,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== id);
    return initialLength > this.products.length;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Cart methods
  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = this.cartItems.find(item => 
      item.userId === cartItemData.userId && item.productId === cartItemData.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += cartItemData.quantity;
      existingItem.updatedAt = new Date();
      return existingItem;
    }

    // Add new item
    const cartItem: CartItem = {
      id: this.nextIds.cartItem++,
      ...cartItemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cartItems.push(cartItem);
    return cartItem;
  }

  async getCartByUserId(userId: number): Promise<CartItem[]> {
    return this.cartItems.filter(item => item.userId === userId);
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | null> {
    const index = this.cartItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    this.cartItems[index].quantity = quantity;
    this.cartItems[index].updatedAt = new Date();
    return this.cartItems[index];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.id !== id);
    return initialLength > this.cartItems.length;
  }

  async clearCart(userId: number): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.userId !== userId);
    return initialLength > this.cartItems.length;
  }

  // Order methods
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order: Order = {
      id: this.nextIds.order++,
      ...orderData,
      status: orderData.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.orders.find(order => order.id === id) || null;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return this.orders.filter(order => order.userId === userId);
  }

  async getAllOrders(): Promise<Order[]> {
    return [...this.orders];
  }

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order | null> {
    const index = this.orders.findIndex(order => order.id === id);
    if (index === -1) return null;
    
    this.orders[index].status = status;
    this.orders[index].updatedAt = new Date();
    return this.orders[index];
  }

  // Wishlist methods
  async addToWishlist(userId: number, productId: number): Promise<boolean> {
    const exists = this.wishlistItems.some(item => 
      item.userId === userId && item.productId === productId
    );
    if (exists) return true;
    
    this.wishlistItems.push({ userId, productId });
    return true;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const initialLength = this.wishlistItems.length;
    this.wishlistItems = this.wishlistItems.filter(item => 
      !(item.userId === userId && item.productId === productId)
    );
    return initialLength > this.wishlistItems.length;
  }

  async getWishlistByUserId(userId: number): Promise<Product[]> {
    const productIds = this.wishlistItems
      .filter(item => item.userId === userId)
      .map(item => item.productId);
    
    return this.products.filter(product => productIds.includes(product.id));
  }

  async isProductInWishlist(userId: number, productId: number): Promise<boolean> {
    return this.wishlistItems.some(item => 
      item.userId === userId && item.productId === productId
    );
  }
}