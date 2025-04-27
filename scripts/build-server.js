
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the dist directory exists
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Compile TypeScript server file
console.log('Compiling server code...');
exec('npx tsc --esModuleInterop --outDir ./dist ./src/server/index.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Compilation error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Server compiled successfully.`);
  console.log(`To run the server, execute: node ./dist/server/index.js`);
});
