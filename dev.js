import { spawn } from 'child_process';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startDev() {
  console.log('🚀 Starting development server...');
  
  // Start the server
  const server = spawn('cross-env', ['NODE_ENV=development', 'tsx', 'server/index.ts'], {
    stdio: 'inherit',
    shell: true
  });

  // Wait a bit for the server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Open browser
  try {
    console.log('🌐 Opening browser...');
    await execAsync('start http://localhost:5000');
    console.log('✅ Browser opened successfully!');
  } catch (error) {
    console.log('⚠️  Could not open browser automatically. Please open http://localhost:5000 manually.');
  }

  // Handle server process
  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit();
  });
}

startDev().catch(console.error); 