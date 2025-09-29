// backend/routes/heatmap.js
const express = require('express');
const { getHeatMapData, getTrafficTrends, getMarketLayout } = require('../controllers/heatMapController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes are protected (require authentication)
router.use(protect);

// @route   GET /api/heatmap/data
router.get('/data', getHeatMapData);

// @route   GET /api/heatmap/trends/:vendorId
router.get('/trends/:vendorId', getTrafficTrends);

// @route   GET /api/heatmap/layout
router.get('/layout', getMarketLayout);

module.exports = router;
