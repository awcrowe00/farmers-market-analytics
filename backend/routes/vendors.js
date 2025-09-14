const express = require('express');
const router = express.Router();

// Placeholder routes - we'll implement these later
router.get('/', (req, res) => {
  res.json({ message: 'Vendors route working' });
});

module.exports = router;