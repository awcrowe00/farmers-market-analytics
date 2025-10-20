const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadProfilePicture, getProfilePicture, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import protect and authorizeRoles middleware

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local file storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profilePicture-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

router.route('/profilepicture').put(protect, upload.single('profilePicture'), uploadProfilePicture);
router.route('/profilepicture/:filename').get(getProfilePicture);

router.route('/:id').put(protect, updateUserProfile);
router.route('/').get(protect, authorizeRoles('super_admin'), getAllUsers);

module.exports = router;
