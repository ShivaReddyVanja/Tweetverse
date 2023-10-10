const multer = require('multer');

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The directory where images will be stored
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the image
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Create the multer instance
const upload = multer({ storage });

module.exports = upload;
