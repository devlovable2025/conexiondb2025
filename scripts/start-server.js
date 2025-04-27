
const { spawn } = require('child_process');

console.log('Starting server...');
const server = spawn('node', ['./dist/server/index.js'], { stdio: 'inherit' });

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
