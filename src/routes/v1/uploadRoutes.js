const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const logger = require('../../utils/logger');
const router = express.Router();
// const imageType = require('image-type');

// Set up file size limits (5MB max) and file type filter (images only)
const fileTypes = /jpeg|jpg|png|gif/;

// Sanitize the file name to prevent path traversal
const sanitizeFilename = (filename) => {
  return filename.replace(/\.\.(\/|\\)/g, ''); // Remove any "../" in file names
};

// Setup storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
    const sanitizedFilename = sanitizeFilename(uniqueSuffix + path.extname(file.originalname));
    cb(null, sanitizedFilename); // Generate a unique name using timestamp and random string
  },
});

// File filter to check file type and MIME type
const fileFilter = function (req, file, cb) {
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    // const isValidImage = imageType(file.buffer);
    if (extname && mimetype && isValidImage) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  };

// Multer to handle file uploads.
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: fileFilter,
  });

// @route   POST /api/v1/uploads
// @desc    Upload image
// @access  Public (or Private if necessary)
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    logger.info('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  logger.info(`File uploaded successfully: ${req.file.filename}`);
  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file,
  });
});

module.exports = router;
