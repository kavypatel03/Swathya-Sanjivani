// middleware/upload.middleware.js
const multer = require('multer');

// Set up multer
const upload = multer({
    storage: multer.memoryStorage(),  // Or any other storage options
});

module.exports = upload.single('file');  // The field name should match the one in the form
