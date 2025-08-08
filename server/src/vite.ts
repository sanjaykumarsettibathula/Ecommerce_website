import type { Express } from "express";
import path from "path";
import fs from "fs";

export function log(message: string) {
  console.log(message);
}

/**
 * Dev mode: start Vite server and proxy requests.
 */
export async function setupVite(app: Express, server: any) {
  try {
    const vite = await import("vite");
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(viteServer.middlewares);

    log("⚡ Vite dev server running");
  } catch (err) {
    console.error("❌ Vite is not installed. Skipping dev server setup.");
  }
}

/**
 * Prod mode: serve static files from frontend build.
 */
export function serveStatic(app: Express) {
  try {
    const clientDistPath = path.resolve(__dirname, "../client/dist");

    if (!fs.existsSync(clientDistPath)) {
      log(
        `⚠️ Client build directory not found at ${clientDistPath}. Skipping static file serving.`
      );
      return;
    }

    const express = require("express");
    app.use(express.static(clientDistPath));

    // Serve index.html for any non-API routes
    app.get("*", (_req, res) => {
      res.sendFile(path.join(clientDistPath, "index.html"));
    });

    log("📦 Serving static frontend build");
  } catch (err) {
    console.error("❌ Error setting up static file serving:", err);
  }
}
