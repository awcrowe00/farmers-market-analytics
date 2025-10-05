const User = require('../models/User');
const asyncHandler = require('express-async-handler');
// const path = require('path'); // No longer needed for local file paths
const { upload, mongoose } = require('../server'); // Import the upload instance and mongoose from server.js

const Grid = require('gridfs-stream');

let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

// @desc    Upload user profile picture
// @route   PUT /api/users/profilepicture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (req.file) {
    const user = await User.findById(req.user._id);

    if (user) {
      user.profilePicture = req.file.id; // Store GridFS file ID
      await user.save();
      res.json({ message: 'Profile picture updated', profilePicture: user.profilePicture }); // Send file ID
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
// @route   GET /api/users/profilepicture/:id
// @access  Public
const getProfilePicture = asyncHandler(async (req, res) => {
  const file = await gfs.files.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

  if (!file || file.length === 0) {
    return res.status(404).json({
      err: 'No file exists'
    });
  }

  if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  } else {
    res.status(404).json({
      err: 'Not an image'
    });
  }
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
