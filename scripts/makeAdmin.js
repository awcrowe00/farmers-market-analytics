// scripts/makeAdmin.js
// Script to make a user an admin by updating MongoDB directly
// Usage: node scripts/makeAdmin.js <userEmail> [role]
// Example: node scripts/makeAdmin.js user@example.com admin

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../backend/models/User');

const makeAdmin = async () => {
  try {
    const email = process.argv[2];
    const role = process.argv[3] || 'admin';

    if (!email) {
      console.error('Usage: node scripts/makeAdmin.js <userEmail> [role]');
      console.error('Example: node scripts/makeAdmin.js user@example.com admin');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmers-market-analytics');
    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Update role
    user.role = role;
    await user.save();

    console.log(`✅ Successfully updated ${user.name} (${user.email}) to role: ${role}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();

