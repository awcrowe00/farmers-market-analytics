const express = require('express');
const router = express.Router();
const eventDataController = require('../controllers/eventDataController');

router.get('/', eventDataController.getAllEventData);
router.post('/', eventDataController.createEventData);

module.exports = router;

