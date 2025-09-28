const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadProfilePicture } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

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

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.route('/profilepicture').put(protect, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
