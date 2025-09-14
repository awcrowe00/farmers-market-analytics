const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have an auth middleware

router.get('/', protect, trafficController.getAllTrafficData);
router.post('/', protect, trafficController.createTrafficData);

module.exports = router;


// Placeholder routes - we'll implement these later
router.get('/', (req, res) => {
  res.json({ message: 'Traffic route working' });
});

module.exports = router;
