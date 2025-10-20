// backend/controllers/eventDataController.js
const EventData = require('../models/EventData');

// Get all event data
exports.getAllEventData = async (req, res) => {
  try {
    // Debug logging
    console.log('getAllEventData called');
    console.log('User from request:', req.user);
    console.log('User company:', req.user?.company);
    
    const eventData = await EventData.find({
      company: req.user.company,
    });
    
    console.log('Found event data count:', eventData.length);
    console.log('Event data:', eventData);
    
    res.status(200).json(eventData);
  } catch (error) {
    console.error('Error in getAllEventData:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new event data
exports.createEventData = async (req, res) => {
  const eventData = new EventData({
    company: req.user.company, // Assign company from authenticated user
    date: req.body.date,
    count: req.body.count,
    location: req.body.location,
    weather: req.body.weather,
  });

  try {
    const newEventData = await eventData.save();
    res.status(201).json(newEventData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};