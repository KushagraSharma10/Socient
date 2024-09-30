const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post', // Reference to the Post model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User', // Reference to the User model
    // required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userDp: {
    type: String,
    // default: "https://via.placeholder.com/50", // Default profile picture
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral'],
    default: 'Neutral',
  },
});

// Create a model from the schema
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
