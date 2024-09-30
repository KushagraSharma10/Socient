const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment'); // Import the Comment model
const createComment = require('../controllers/commentController');

// Example route for creating a comment
router.post('/:postId/comments',createComment);

// Example route for getting comments for a post
router.get('/:postId/comments', async (req, res) => {
  // Logic to fetch comments for a specific post
});

// Example route for deleting a comment
router.delete('/:postId/comments/:commentId', async (req, res) => {
  // Logic to delete a comment
});

// Other comment-related routes...

module.exports = router;
