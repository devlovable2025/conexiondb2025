
const { spawn } = require('child_process');

console.log('Starting server on port 3002...');
const server = spawn('node', ['./dist/server/index.js'], { 
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3002'
  } 
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
