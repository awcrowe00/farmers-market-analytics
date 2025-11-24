const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  attendees: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  marketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Market',
  },
}, {
  timestamps: true,
});

// Index for efficient querying
eventSchema.index({ date: -1 });

module.exports = mongoose.model('Event', eventSchema);