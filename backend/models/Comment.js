const mongoose = require('mongoose');

// Define the comment schema
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userDp: {
    type: String,
    default: "https://via.placeholder.com/50", // Default profile picture if none is provided
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

// Create a model from the schema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
