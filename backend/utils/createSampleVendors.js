const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const User = require('../models/User');
require('dotenv').config();

const createSampleVendors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete existing vendors
    await Vendor.deleteMany({});
    
    const sampleVendors = [
      { name: "Fresh Produce Co.", category: "produce", boothNumber: "A1", location: { x: 150, y: 120 } },
      { name: "Artisan Breads", category: "bakery", boothNumber: "A2", location: { x: 250, y: 120 } },
      { name: "Honey Heaven", category: "honey", boothNumber: "A3", location: { x: 350, y: 120 } },
      { name: "Flower Power", category: "flowers", boothNumber: "A4", location: { x: 450, y: 120 } },
      { name: "Craft Corner", category: "crafts", boothNumber: "A5", location: { x: 550, y: 120 } },
      { name: "Farm Fresh Dairy", category: "dairy", boothNumber: "B1", location: { x: 150, y: 220 } },
      { name: "Organic Greens", category: "produce", boothNumber: "B2", location: { x: 250, y: 220 } },
      { name: "Hot Food Stand", category: "prepared_food", boothNumber: "B3", location: { x: 350, y: 220 } },
      { name: "Jam & Jellies", category: "other", boothNumber: "B4", location: { x: 450, y: 220 } },
      { name: "Apple Orchard", category: "produce", boothNumber: "C1", location: { x: 150, y: 320 } },
      { name: "Sourdough Sam", category: "bakery", boothNumber: "C2", location: { x: 250, y: 320 } },
      { name: "Coffee Cart", category: "prepared_food", boothNumber: "C3", location: { x: 350, y: 320 } },
      { name: "Cheese Please", category: "dairy", boothNumber: "C4", location: { x: 450, y: 320 } },
    ];

    const createdVendors = await Vendor.insertMany(sampleVendors);
    console.log(`Created ${createdVendors.length} sample vendors`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample vendors:', error);
    process.exit(1);
  }
};

createSampleVendors();