const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

router.get('/', protect, trafficController.getAllTrafficData);
router.post('/', protect, trafficController.createTrafficData);

module.exports = router;


// Add this route for event data
router.get('/eventData', (req, res) => {
  // Mock data for now
  const mockEventData = [
    {
      id : "68c73acc78f827fddba5c64e",
      company : "Company A",
      date : "2025-08-15T17:00:00.000+00:00",
      count : 37,
      location : "Market Square A",
      weather: 'sunny'
    },
  ];
  
  res.json({
    success: true,
    data: mockEventData
  });
});

// Your other routes...
router.get('/', (req, res) => {
  res.json({ message: 'Traffic route working' });
});

module.exports = router;