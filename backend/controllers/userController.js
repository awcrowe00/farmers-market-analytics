const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Upload user profile picture
// @route   PUT /api/users/profilepicture
// @access  Private
const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (req.file) {
    const user = await User.findById(req.user._id);

    if (user) {
      // Convert file buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      const contentType = req.file.mimetype;
      
      // Store image data and content type in MongoDB
      user.profilePicture = {
        data: base64Image,
        contentType: contentType
      };
      
      await user.save();
      
      // Return a reference ID for the frontend (we'll use user ID)
      res.json({ 
        message: 'Profile picture updated', 
        profilePicture: user._id.toString() // Return user ID as reference
      });
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
// @route   GET /api/users/profilepicture/:userId
// @access  Public
const getProfilePicture = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user || !user.profilePicture || !user.profilePicture.data) {
    return res.status(404).json({
      err: 'Profile picture not found'
    });
  }

  // Convert base64 to buffer
  const imageBuffer = Buffer.from(user.profilePicture.data, 'base64');
  
  // Set appropriate content type
  res.setHeader('Content-Type', user.profilePicture.contentType || 'image/jpeg');
  res.send(imageBuffer);
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
    profilePicture: updatedUser.profilePicture?.data ? updatedUser._id.toString() : null,
    enabledGraphs: updatedUser.enabledGraphs || {
      trafficChart: true,
      weatherChart: true,
      eventChart: true,
      heatMap: true,
    },
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  // Transform profilePicture to return userId if image exists
  const usersWithTransformedProfilePicture = users.map(user => {
    const userObj = user.toObject();
    userObj.profilePicture = user.profilePicture?.data ? user._id.toString() : null;
    // Ensure enabledGraphs is included
    if (!userObj.enabledGraphs) {
      userObj.enabledGraphs = {
        trafficChart: true,
        weatherChart: true,
        eventChart: true,
        heatMap: true,
      };
    }
    return userObj;
  });
  res.json(usersWithTransformedProfilePicture);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent deleting yourself
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('Cannot delete your own account');
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: 'User deleted successfully' });
});

// @desc    Update user company
// @route   PUT /api/users/:id/company
// @access  Private/Admin
const updateUserCompany = asyncHandler(async (req, res) => {
  const { company } = req.body;

  if (!company) {
    res.status(400);
    throw new Error('Company is required');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.company = company;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    company: user.company,
  });
});

// @desc    Update user graph visibility
// @route   PUT /api/users/:id/graphs
// @access  Private/Admin
const updateUserGraphs = asyncHandler(async (req, res) => {
  const { enabledGraphs } = req.body;

  if (!enabledGraphs || typeof enabledGraphs !== 'object') {
    res.status(400);
    throw new Error('enabledGraphs object is required');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update enabled graphs
  user.enabledGraphs = {
    trafficChart: enabledGraphs.trafficChart !== undefined ? enabledGraphs.trafficChart : user.enabledGraphs.trafficChart,
    weatherChart: enabledGraphs.weatherChart !== undefined ? enabledGraphs.weatherChart : user.enabledGraphs.weatherChart,
    eventChart: enabledGraphs.eventChart !== undefined ? enabledGraphs.eventChart : user.enabledGraphs.eventChart,
    heatMap: enabledGraphs.heatMap !== undefined ? enabledGraphs.heatMap : user.enabledGraphs.heatMap,
  };

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    enabledGraphs: user.enabledGraphs,
  });
});

module.exports = {
  uploadProfilePicture,
  getProfilePicture,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserCompany,
  updateUserGraphs,
};
