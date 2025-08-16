// Import necessary libraries
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

// Initialize the express application
const app = express();

// Use middleware
// CORS allows your frontend to make requests to this backend
app.use(cors()); 
// express.json allows the server to accept JSON data in requests
app.use(express.json()); 

// Define the port the server will run on
const PORT = process.env.PORT || 5000;

// --- API Endpoints ---

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

/**
 * @route   POST /hash
 * @desc    Accepts an Aadhaar number, hashes it, and returns the hash.
 * @access  Public
 */
app.post('/hash', (req, res) => {
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber) {
    // If the aadhaarNumber is not provided, send a 400 Bad Request error
    return res.status(400).json({ error: 'Aadhaar number is required.' });
  }

  try {
    // Hash the Aadhaar number using the same method as the smart contract
    const aadhaarHash = ethers.solidityPackedKeccak256(['string'], [aadhaarNumber]);
    
    // Send the hash back to the frontend in a JSON response
    res.json({ hash: aadhaarHash });
  } catch (error) {
    console.error('Hashing error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});


// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});