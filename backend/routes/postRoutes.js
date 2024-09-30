const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Post model
const { createPost, getPosts } = require('../controllers/postController');
const upload = require('../config/multer-config');
const authenticateToken = require('../middlewares/authenticateToken');

// Example route for creating a post
router.post('/',authenticateToken, upload.single("image"), createPost);

// Example route for getting all posts
router.get('/', getPosts);

// Example route for deleting a post
router.delete('/:postId', async (req, res) => {
  // Logic to delete a post
});

// Other post-related routes...

module.exports = router;
