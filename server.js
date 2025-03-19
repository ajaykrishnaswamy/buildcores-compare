require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize express app
const app = express();

// Set port
const PORT = process.env.PORT || 3001;

// Log environment variables
console.log('Environment variables loaded:');
console.log(`- PORT: ${PORT}`);
console.log(`- API Base URL: ${process.env.REACT_APP_API_BASE_URL || 'https://www.api.buildcores.com'}`);
console.log(`- API Full URL: ${process.env.REACT_APP_API_FULL_URL || 'https://www.api.buildcores.com/api/official/database/parts'}`);

// Enable cors
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints should go here if needed

// All other requests send the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Check if port is in use
const checkPortInUse = () => {
  return new Promise((resolve, reject) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use.`);
        resolve(true);
      } else {
        reject(err);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(PORT);
  });
};

// Start the server with port availability check
(async () => {
  try {
    const isPortInUse = await checkPortInUse();
    
    if (isPortInUse) {
      console.log(`Try starting with a different port: PORT=3002 node server.js`);
      process.exit(1);
    } else {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
})(); 