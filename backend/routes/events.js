const express = require('express');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get all events
// @route   GET /api/events/data
// @access  Private
router.get('/data', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const events = await Event.find(dateFilter).sort({ date: -1 }).lean();
    
    // Format data for the chart
    const formattedEvents = events.map(event => ({
      date: event.date.toLocaleDateString(),
      attendees: event.attendees,
      eventName: event.name,
      description: event.description,
    }));
    
    res.json({
      success: true,
      data: formattedEvents
    });
  } catch (error) {
    console.error('Error fetching event data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;