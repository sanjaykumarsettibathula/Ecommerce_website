import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { seedDatabase } from "./seed";
import { MemoryStorage } from "./memory-storage";
import { DatabaseStorage } from "./database-storage";
import type { IStorage } from "./storage";
import cors from 'cors';

// Simple logger (no vite dependency)
const log = console.log;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed origins
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }

    // For development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));


(async () => {
  const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET", "SESSION_SECRET"];
  if (process.env.NODE_ENV === "production") {
    requiredEnvVars.push("DATABASE_URL");
  }

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (missingEnvVars.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missingEnvVars.join(", ")
    );
    process.exit(1);
  }

  let storage: IStorage;

  try {
    if (process.env.DATABASE_URL) {
      console.log(
        "💾 Using DatabaseStorage with connection string:",
        process.env.DATABASE_URL
      );
      storage = new DatabaseStorage();
      console.log("🌱 Seeding database...");
      await seedDatabase(storage);
      console.log("✅ Database seeded successfully!");
    } else {
      console.log("⚠️ No DATABASE_URL found, using MemoryStorage");
      storage = new MemoryStorage();
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    console.log("⚠️ Falling back to MemoryStorage");
    storage = new MemoryStorage();
  }

  // Register API routes only
  const server = await registerRoutes(app, storage);

  const optionalEnvVars = ["VITE_STRIPE_PUBLIC_KEY", "STRIPE_SECRET_KEY"];
  const missingOptionalVars = optionalEnvVars.filter(
    (varName) => !process.env[varName]
  );
  if (missingOptionalVars.length > 0) {
    log(
      `⚠️  Missing optional environment variables: ${missingOptionalVars.join(
        ", "
      )}`
    );
    log("Please set these environment variables for full functionality.");
  }

  // No serveStatic in production — this is now an API-only backend
  const PORT = parseInt(process.env.PORT || "5000", 10);
  server.listen(PORT, "0.0.0.0", () => {
    log(`🚀 API server running on port ${PORT}`);
  });
})();