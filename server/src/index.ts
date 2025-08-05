import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import { MemoryStorage } from "./memory-storage";
import { DatabaseStorage } from "./database-storage";
import type { IStorage } from "./storage";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware - more secure configuration
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

(async () => {
  // Validate required environment variables
  const requiredEnvVars = [
    'JWT_SECRET',
    'SESSION_SECRET'
  ];
  
  // Only require DATABASE_URL in production
  if (process.env.NODE_ENV === 'production') {
    requiredEnvVars.push('DATABASE_URL');
  }
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    console.error('Please set these environment variables before starting the server.');
    process.exit(1);
  }

  // Create storage instance based on environment
  let storage: IStorage;
  
  // Fallback to memory storage if database seeding fails
  try {
    if (process.env.DATABASE_URL) {
      console.log('💾 Using DatabaseStorage with connection string:', process.env.DATABASE_URL);
      storage = new DatabaseStorage();
      console.log('🌱 Seeding database...');
      await seedDatabase(storage);
      console.log('✅ Database seeded successfully!');
    } else {
      console.log('⚠️ No DATABASE_URL found, using MemoryStorage');
      storage = new MemoryStorage();
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.log('⚠️ Falling back to MemoryStorage');
    storage = new MemoryStorage();
    console.log('🌱 Initializing MemoryStorage with seed data...');
  }

  // Pass the storage instance to registerRoutes
  const server = await registerRoutes(app, storage);

  // Environment check for optional variables
  const optionalEnvVars = ['VITE_STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY'];
  const missingOptionalVars = optionalEnvVars.filter(varName => !process.env[varName]);
  
  if (missingOptionalVars.length > 0) {
    log(`⚠️  Missing optional environment variables: ${missingOptionalVars.join(', ')}`);
    log('Please set these environment variables for full functionality:');
    log('1. Go to https://dashboard.stripe.com/apikeys');
    log('2. VITE_STRIPE_PUBLIC_KEY - copy your "Publishable key" (starts with pk_)');
    log('3. STRIPE_SECRET_KEY - copy your "Secret key" (starts with sk_)');
  }

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = parseInt(process.env.PORT || '5000', 10);
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();
