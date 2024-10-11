const multer = require('multer');

// Use memory storage (can be changed to diskStorage if needed)
const storage = multer.memoryStorage(); 

// For single file upload (e.g., profile picture)
const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).single('profilePicture'); // 'profilePicture' is the field name

// For multiple file uploads (e.g., post images)
const uploadMultiple = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
}).array('images', 10); // 'images' is the field name for multiple image uploads, limit to 10 files

module.exports = {
    uploadSingle,
    uploadMultiple,
};
