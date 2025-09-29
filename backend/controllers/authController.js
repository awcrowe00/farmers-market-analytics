const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, email, company) => {
  return jwt.sign({ id, role, email, company }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    const { name, email, password, role, company } = req.body;


    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'vendor',
      company,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        token: generateToken(user._id, user.role, user.email, user.company),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    // Check for user email
    const user = await User.findOne({ email }).populate('vendorId');
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('Checking password...');
      // Check if matchPassword method exists
      if (typeof user.matchPassword === 'function') {
        const isMatch = await user.matchPassword(password);
        console.log('Password match result:', isMatch);
        
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vendorId: user.vendorId,
            token: generateToken(user._id, user.role, user.email),
          });
        }
      } else {
        console.log('matchPassword method not found, using bcrypt directly');
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);
        
        if (isMatch) {
          return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vendorId: user.vendorId,
            token: generateToken(user._id, user.role, user.email),
          });
        }
      }
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};