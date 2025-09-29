const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Upload user profile picture
// @route   PUT /api/users/profilepicture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (req.file) {
    const user = await User.findById(req.user._id);

    if (user) {
      user.profilePicture = `/uploads/${req.file.filename}`;
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

module.exports = {
  uploadProfilePicture,
};
