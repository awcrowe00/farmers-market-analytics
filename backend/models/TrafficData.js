// backend/models/TrafficData.js
const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  customerCount: {
    type: Number,
    required: true,
    default: 0,
  },
  dwellTime: {
    type: Number, // Average seconds spent at booth
    default: 0,
  },
  weather: {
    temperature: Number,
    condition: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'windy', 'cold', 'hot']
    },
    humidity: Number,
  },
  dayOfWeek: String,
  hourOfDay: Number,
  sales: {
    estimated: Number,
    actual: Number, // Can be filled in later by vendor
  }
}, {
  timestamps: true,
});

// Index for efficient querying
trafficDataSchema.index({ vendorId: 1, timestamp: -1 });
trafficDataSchema.index({ company: 1, timestamp: -1 });
trafficDataSchema.index({ timestamp: -1 });

module.exports = mongoose.model('TrafficData', trafficDataSchema);