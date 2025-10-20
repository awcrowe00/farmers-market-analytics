const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');

// @desc    Upload user profile picture
// @route   PUT /api/users/profilepicture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (req.file) {
    const user = await User.findById(req.user._id);

    if (user) {
      // Delete old profile picture if it exists
      if (user.profilePicture) {
        const oldFilePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      user.profilePicture = req.file.filename; // Store filename
      await user.save();
      res.json({ message: 'Profile picture updated', profilePicture: user.profilePicture });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } else {
    res.status(400);
    throw new Error('No file uploaded');
  }
});

// @desc    Get user profile picture
// @route   GET /api/users/profilepicture/:filename
// @access  Public
const getProfilePicture = asyncHandler(async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      err: 'File not found'
    });
  }

  // Set appropriate content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'image/jpeg'; // default
  if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

  res.setHeader('Content-Type', contentType);
  res.sendFile(filePath);
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (super_admin can update any user, others can only update their own)
const updateUserProfile = asyncHandler(async (req, res) => {
  const userToUpdateId = req.params.id;
  const { name, email, role, company } = req.body;

  let user = await User.findById(userToUpdateId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if the authenticated user is updating their own profile or is a super_admin
  if (req.user.id.toString() !== userToUpdateId && req.user.role !== 'super_admin') {
    res.status(403);
    throw new Error('Not authorized to update this user');
  }

  // Super admin can update all fields for any user
  if (req.user.role === 'super_admin') {
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role; // Super admin can change roles
    user.company = company || user.company; // Super admin can change company
  } else {
    // Regular users can only update their own name and email
    user.name = name || user.name;
    user.email = email || user.email;
    // Prevent regular users from changing role or company
    if (req.body.role && req.body.role !== user.role) {
      res.status(400);
      throw new Error('Not authorized to change role');
    }
    if (req.body.company && req.body.company !== user.company) {
      res.status(400);
      throw new Error('Not authorized to change company');
    }
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    company: updatedUser.company,
    profilePicture: updatedUser.profilePicture,
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/SuperAdmin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = {
  uploadProfilePicture,
  getProfilePicture,
  updateUserProfile,
  getAllUsers,
};
