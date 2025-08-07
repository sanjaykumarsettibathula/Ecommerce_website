import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const serverPublicPath = path.resolve(__dirname, 'dist', 'public');

// Create the public directory if it doesn't exist
if (!fs.existsSync(serverPublicPath)) {
  console.log(`Creating directory: ${serverPublicPath}`);
  fs.mkdirSync(serverPublicPath, { recursive: true });
}

// Build the server
console.log('Building server...');
try {
  execSync('esbuild src/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
  console.log('Server build completed successfully!');
} catch (error) {
  console.error('Error building server:', error);
  process.exit(1);
}

// Create an empty index.html in the public directory to prevent errors
const indexHtmlPath = path.join(serverPublicPath, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  fs.writeFileSync(indexHtmlPath, '<html><body><h1>API Server</h1><p>This is the API server. The frontend is hosted separately.</p></body></html>');
  console.log('Created placeholder index.html');
}

console.log('Build process completed!');