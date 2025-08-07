import type { Express } from "express";
import { createServer, type Server } from "http";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Stripe from "stripe";

import type { IStorage } from "./storage";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertProductSchema, insertCartItemSchema, insertOrderSchema, type Product, FrontendUser } from "./types/schema";
import expressSession from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY environment variable. Stripe payments will not work.');
}

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Check if Google OAuth is properly configured
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️  Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
}

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Type for authenticated user
interface AuthenticatedUser {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

// Session middleware (for OAuth)
export async function registerRoutes(app: Express, storageInstance?: IStorage): Promise<Server> {
  // Use the passed storage instance or the global one
  const storageToUse = storageInstance || storage;
  app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport Google Strategy
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google OAuth profile received:', {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails?.map(e => e.value),
        name: profile.name
      });
      
      // Find or create user in DB
      if (!profile.emails || !profile.emails[0]) {
        console.error('No email found in Google profile');
        return done(new Error('No email found in Google profile'));
      }
      
      const email = profile.emails[0].value;
      console.log('Looking up user by email:', email);
      
      let user = await storageToUse.getUserByEmail(email);
      if (!user) {
        console.log('Creating new user for Google OAuth');
        user = await storageToUse.createUser({
          email: email,
          password: '', // No password for social login
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          role: 'user',
        });
        console.log('New user created:', { id: user.id, email: user.email });
      } else {
        console.log('Existing user found:', { id: user.id, email: user.email });
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth strategy error:', error);
      return done(error);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: number, done) => {
    const user = await storageToUse.getUserById(id);
    done(null, user);
  });

  // Google OAuth endpoints
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback', passport.authenticate('google', { failureRedirect: '/auth?error=GoogleAuthFailed' }), (req: any, res) => {
    try {
      // Issue JWT and redirect to frontend with token
      const user = req.user;
      if (!user) {
        console.error('Google OAuth callback: No user found in request');
        return res.redirect(`/auth?error=NoUser`);
      }
      
      console.log('Google OAuth callback: User authenticated:', { id: user.id, email: user.email });
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token in query param
      res.redirect(`/auth?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`/auth?error=TokenGenerationFailed`);
    }
  });

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storageToUse.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storageToUse.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storageToUse.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storageToUse.getUserById((req.user as AuthenticatedUser)?.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User update endpoint
  app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const authUser = (req.user as AuthenticatedUser);
      
      // Check if user is updating their own profile or is admin
      if (authUser.id !== userId && authUser.role !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }

      const updateData: Partial<FrontendUser> = {};
      if (req.body.firstName) updateData.firstName = req.body.firstName;
      if (req.body.lastName) updateData.lastName = req.body.lastName;
      if (req.body.email) updateData.email = req.body.email;

      const updatedUser = await storageToUse.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category } = req.query;
      
      let products;
      if (search) {
        products = await storageToUse.searchProducts(search as string);
      } else if (category) {
        products = await storageToUse.getProductsByCategory(category as string);
      } else {
        products = await storageToUse.getAllProducts();
      }

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storageToUse.getProductById(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storageToUse.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      // Only include allowed fields and valid status
      const updateData: Partial<Product> = {};
      if (typeof productData.name === 'string') updateData.name = productData.name;
      if (typeof productData.description === 'string') updateData.description = productData.description;
      if (typeof productData.price === 'string') updateData.price = productData.price;
      if (typeof productData.category === 'string') updateData.category = productData.category;
      if (typeof productData.imageUrl === 'string') updateData.imageUrl = productData.imageUrl;
      if (typeof productData.stock === 'number') updateData.stock = productData.stock;
      if (typeof productData.sku === 'string') updateData.sku = productData.sku;
      if (productData.status === 'active' || productData.status === 'inactive') updateData.status = productData.status;
      const product = await storageToUse.updateProduct(Number(req.params.id), updateData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const deleted = await storageToUse.deleteProduct(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cart routes
  app.get("/api/cart", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      const cartItems = await storageToUse.getCartByUserId(userId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storageToUse.getProductById(item.productId);
          return {
            ...item,
            product,
          };
        })
      );

      res.json(cartWithProducts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cart", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const cartItem = await storageToUse.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/cart/:id", authenticateToken, async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await storageToUse.updateCartItem(Number(req.params.id), quantity);
      if (!cartItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cart/:id", authenticateToken, async (req, res) => {
    try {
      const deleted = await storageToUse.removeFromCart(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json({ message: "Item removed from cart" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/cart", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      await storageToUse.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Order routes
  app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const userRole = (req.user as AuthenticatedUser)?.role;
      if (!userId || !userRole) return res.status(401).json({ error: 'User not authenticated' });
      let orders;
      if (userRole === 'admin') {
        orders = await storageToUse.getAllOrders();
      } else {
        orders = await storageToUse.getOrdersByUserId(userId);
      }
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const order = await storageToUse.getOrderById(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      const userId = (req.user as AuthenticatedUser)?.id;
      const userRole = (req.user as AuthenticatedUser)?.role;
      if (!userId || !userRole) return res.status(401).json({ error: 'User not authenticated' });
      // Check if user owns this order or is admin
      if (order.userId !== userId && userRole !== 'admin') {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) return res.status(401).json({ error: 'User not authenticated' });
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      const order = await storageToUse.createOrder(orderData);
      // Clear cart after order is created
      await storageToUse.clearCart(userId);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/orders/:id/status", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storageToUse.updateOrderStatus(Number(req.params.id), status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", authenticateToken, async (req, res) => {
    try {
      console.log("[Stripe] Incoming create-payment-intent request:", req.body);
      if (!stripe) {
        console.error("[Stripe] Stripe not configured");
        return res.status(500).json({ error: "Stripe not configured" });
      }

      let { amount } = req.body;
      // Remove commas if amount is a string (e.g., '2,46,921')
      if (typeof amount === 'string') {
        amount = amount.replace(/,/g, '');
      }
      const amountInINR = Number(amount);
      // Convert INR to USD (use a fixed rate, e.g., 1 USD = 83 INR)
      const USD_CONVERSION_RATE = 83;
      const amountInUSD = amountInINR / USD_CONVERSION_RATE;
      // Stripe expects amount in cents for USD
      const amountInCents = Math.round(amountInUSD * 100);

      console.log('[Stripe] Amount from frontend (INR):', amountInINR);
      console.log('[Stripe] Amount sent to Stripe (USD cents):', amountInCents);

      const userId = (req.user as AuthenticatedUser)?.id;
      if (!userId) {
        console.error("[Stripe] User not authenticated");
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        metadata: { userId },
      });

      console.log("[Stripe] PaymentIntent created:", paymentIntent.id);
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("[Stripe] Error creating payment intent:", error);
      res.status(500).json({ error: "Error creating payment intent: " + (error as Error).message });
    }
  });

  // Admin stats
  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const products = await storageToUse.getAllProducts();
      const orders = await storageToUse.getAllOrders();
      const users = await storageToUse.getAllUsers();
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalCustomers = users.filter(user => user.role === 'user').length;
      res.json({
        totalSales,
        totalProducts,
        totalOrders,
        totalCustomers,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI recommendations (mock implementation)
  app.get("/api/recommendations", authenticateToken, async (req, res) => {
    try {
      // For now, return some random products as recommendations
      const allProducts = await storageToUse.getAllProducts();
      const recommendations = allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(product => ({
          ...product,
          reason: "Based on your recent purchases"
        }));

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Wishlist routes
  app.get("/api/wishlist", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const products = await storageToUse.getWishlistByUserId(userId);
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wishlist/:productId", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const productId = Number(req.params.productId);
      const added = await storage.addToWishlist(userId, productId);
      res.json({ success: added });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/wishlist/:productId", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const productId = Number(req.params.productId);
      const removed = await storage.removeFromWishlist(userId, productId);
      res.json({ success: removed });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wishlist/:productId", authenticateToken, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.id;
      const productId = Number(req.params.productId);
      const exists = await storage.isProductInWishlist(userId, productId);
      res.json({ inWishlist: exists });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
