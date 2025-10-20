// backend/models/Vendor.js
const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
    default: 'Default Company',
  },
  category: {
    type: String,
    required: true,
    enum: ['produce', 'dairy', 'bakery', 'crafts', 'prepared_food', 'flowers', 'honey', 'other']
  },
  boothNumber: {
    type: String,
    required: true,
  },
  location: {
    x: Number, // Booth coordinates for heat mapping
    y: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [{
    name: String,
    category: String,
    averagePrice: Number,
  }],
  marketDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Vendor', vendorSchema);
