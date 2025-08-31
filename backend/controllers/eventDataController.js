const EventData = require('../models/EventData');

// Get all event data
exports.getAllEventData = async (req, res) => {
  try {
    const eventData = await EventData.find();
    res.status(200).json(eventData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event data
exports.createEventData = async (req, res) => {
  const eventData = new EventData({
    company: req.body.company,
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

