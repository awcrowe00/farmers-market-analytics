const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { protect } = require('./middleware/authMiddleware'); // Import protect middleware
// Note: multer, path, and fs are no longer needed for profile picture storage (now in MongoDB)

const app = express();

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use('/api/heatmap', require('./routes/heatMap')); // Heatmap routes

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
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Note: Profile pictures are now stored in MongoDB, not in the filesystem

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/traffic', protect, require('./routes/traffic'));
const eventDataRoutes = require('./routes/eventData');
app.use('/api/eventData', protect, eventDataRoutes);
app.use('/api/users', require('./routes/user'));
app.use('/api/events', require('./routes/events'));

// Note: Profile pictures are served from MongoDB via /api/users/profilepicture/:userId


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Farmers Market Analytics API is running!' });
});

// Export mongoose and app before starting the server
module.exports = { mongoose, app };
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});