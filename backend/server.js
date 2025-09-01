// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-market-analytics')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/vendors', require('./routes/vendors'));
// app.use('/api/traffic', require('./routes/traffic'));
const eventDataRoutes = require('./routes/eventData');
app.use('/api/eventData', eventDataRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Farmers Market Analytics API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});