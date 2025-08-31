const mongoose = require('mongoose');

const EventDataSchema = new mongoose.Schema({
  company: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
  },
  weather: {
    type: String,
  },
});

module.exports = mongoose.model('EventData', EventDataSchema, 'event_data');

