const multer = require('multer');

const storage = multer.memoryStorage(); // 🔹 Store file in memory, not local storage

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 🔹 Max file size 5MB
});

module.exports = upload;
