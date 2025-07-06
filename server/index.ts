import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

(async () => {
  // Seed the database first
  try {
    await seedDatabase();
  } catch (error) {
    console.error('Failed to seed database:', error);
  }

  const server = await registerRoutes(app);

  // Environment check
  const requiredEnvVars = ['VITE_STRIPE_PUBLIC_KEY', 'STRIPE_SECRET_KEY'];
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    log(`⚠️  Missing required environment variables: ${missingEnvVars.join(', ')}`);
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

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`Server running on port ${PORT}`);
  });
})();
