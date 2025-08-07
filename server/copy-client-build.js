import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const clientDistPath = path.resolve(__dirname, '..', 'client', 'dist');
const serverPublicPath = path.resolve(__dirname, 'dist', 'public');

// Create the public directory if it doesn't exist
if (!fs.existsSync(serverPublicPath)) {
  console.log(`Creating directory: ${serverPublicPath}`);
  fs.mkdirSync(serverPublicPath, { recursive: true });
}

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied: ${srcPath} -> ${destPath}`);
    }
  }
}

// Check if client dist directory exists
if (!fs.existsSync(clientDistPath)) {
  console.error(`Error: Client build directory not found at ${clientDistPath}`);
  console.error('Please run "npm run build:client" first');
  process.exit(1);
}

// Copy client build to server public directory
console.log(`Copying client build from ${clientDistPath} to ${serverPublicPath}`);
try {
  copyDir(clientDistPath, serverPublicPath);
  console.log('Client build copied successfully!');
} catch (error) {
  console.error('Error copying client build:', error);
  process.exit(1);
}