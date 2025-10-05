const express = require('express');
const multer = require('multer'); // Keep multer for fileFilter
const path = require('path'); // Keep path for checkFileType
const { uploadProfilePicture, getProfilePicture, updateUserProfile, getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import protect and authorizeRoles middleware
const { upload: gridfsUpload } = require('../server'); // Import the GridFS configured upload instance

const router = express.Router();

// Remove the local storage configuration
// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  console.log('File Original Name:', file.originalname);
  console.log('File MIME Type:', file.mimetype);
  console.log('Extension Name Test Result:', extname);
  console.log('MIME Type Test Result:', mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images Only!');
  }
}

// Use the imported GridFS upload instance with fileFilter
const upload = multer({ 
  storage: gridfsUpload.storage, // Use the storage from gridfsUpload
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route('/profilepicture').put(protect, upload.single('profilePicture'), uploadProfilePicture);
router.route('/profilepicture/:id').get(getProfilePicture);

router.route('/:id').put(protect, updateUserProfile);
router.route('/').get(protect, authorizeRoles('super_admin'), getAllUsers);

module.exports = router;
