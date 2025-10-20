const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

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
      role: (role === 'super_admin' ? 'vendor' : role) || 'vendor', // Prevent direct registration as super_admin
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
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with email:', email);
  console.log('Password (unhashed) received:', password);

  // Check for user email
  const user = await User.findOne({ email }).populate('vendorId');

  console.log('User found:', user ? user.email : 'None');

  if (user && (await user.matchPassword(password))) {
    console.log('Password matched successfully!');
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendorId: user.vendorId,
      company: user.company,
      token: generateToken(user._id, user.role, user.email, user.company),
    });
  } else {
    console.log('Invalid credentials: user not found or password mismatch.');
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      profilePicture: user.profilePicture,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
