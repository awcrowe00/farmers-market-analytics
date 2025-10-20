const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { protect } = require('./middleware/authMiddleware'); // Import protect middleware
const path = require('path'); // Import path module
const multer = require('multer'); // Import multer
const fs = require('fs'); // Import fs for file operations

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
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local file storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profilePicture-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/traffic', protect, require('./routes/traffic'));
const eventDataRoutes = require('./routes/eventData');
app.use('/api/eventData', protect, eventDataRoutes);
app.use('/api/users', require('./routes/user'));

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));


// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Farmers Market Analytics API is running!' });
});

// Export upload and mongoose before starting the server
module.exports = { upload, mongoose, app };

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});