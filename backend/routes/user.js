const express = require('express');
const multer = require('multer');
const { uploadProfilePicture, getProfilePicture, updateUserProfile, getAllUsers, deleteUser, updateUserCompany, updateUserGraphs } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import protect and authorizeRoles middleware

const router = express.Router();

// Memory storage configuration (stores file in memory as buffer)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

router.route('/profilepicture').put(protect, upload.single('profilePicture'), uploadProfilePicture);
router.route('/profilepicture/:userId').get(getProfilePicture);

// Specific routes before parameterized routes
router.route('/').get(protect, authorizeRoles('admin', 'super_admin'), getAllUsers);
router.route('/:id/company').put(protect, authorizeRoles('admin', 'super_admin'), updateUserCompany);
router.route('/:id/graphs').put(protect, authorizeRoles('admin', 'super_admin'), updateUserGraphs);
router.route('/:id').put(protect, updateUserProfile);
router.route('/:id').delete(protect, authorizeRoles('admin', 'super_admin'), deleteUser);

module.exports = router;
