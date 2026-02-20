// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Enable CORS for all domains
app.use(cors()); // No arguments means all domains are allowed

// Serve static files (like HTML, audio, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('CORS is enabled for all domains');
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});