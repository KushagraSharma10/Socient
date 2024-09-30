const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "" // URL of the post image
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Reference to the Comment model
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
  overallSentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral'],
    default: 'Neutral',
  },
});

// Create a model from the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
