const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { protect } = require('./middleware/authMiddleware'); // Import protect middleware

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmers-market-analytics')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/traffic', protect, require('./routes/traffic'));
const eventDataRoutes = require('./routes/eventData');
app.use('/api/eventData', protect, eventDataRoutes);


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Farmers Market Analytics API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});