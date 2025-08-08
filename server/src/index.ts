import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { seedDatabase } from "./seed";
import { MemoryStorage } from "./memory-storage";
import { DatabaseStorage } from "./database-storage";
import type { IStorage } from "./storage";

// Simple logger (no vite dependency)
const log = console.log;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "http://localhost:5176");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

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
