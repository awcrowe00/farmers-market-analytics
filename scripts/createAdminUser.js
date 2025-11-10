// scripts/createAdminUser.js
// Script to create a new admin user
// Usage: node scripts/createAdminUser.js <name> <email> <password> [company]
// Example: node scripts/createAdminUser.js "Admin User" admin@example.com password123 "Admin Company"

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../backend/models/User');

const createAdmin = async () => {
  try {
    const name = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];
    const company = process.argv[5] || 'Admin Company';

    if (!name || !email || !password) {
      console.error('Usage: node scripts/createAdminUser.js <name> <email> <password> [company]');
      console.error('Example: node scripts/createAdminUser.js "Admin User" admin@example.com password123 "Admin Company"');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/farmers-market-analytics');
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(`User with email ${email} already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      company,
    });

    console.log(`✅ Successfully created admin user:`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Company: ${user.company}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();

