const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Import the Post model
const { createPost, getPosts, likePost, toggleLike, deletePost } = require('../controllers/postController');
const upload = require('../config/multer-config');
const authenticateToken = require('../middlewares/authenticateToken');
const authenticateUser = require('../middlewares/authenticateUser');

// Example route for creating a post
router.post('/',authenticateToken, upload.uploadMultiple, createPost);

// Example route for getting all posts
router.get('/', authenticateUser, getPosts);

// Example route for deleting a post
router.put('/:postId/like', authenticateUser, toggleLike);

router.delete("/:postId", authenticateUser, deletePost);

// Other post-related routes...

module.exports = router;
