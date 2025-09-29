// backend/routes/auth.js
const express = require('express');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Add debug middleware
router.use((req, res, next) => {
  console.log('Auth route hit:', req.method, req.path);
  next();
}); 

router.post('/register', (req, res, next) => {
  console.log('Register route hit');
  next();
}, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
