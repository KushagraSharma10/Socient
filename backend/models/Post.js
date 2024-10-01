
const mongoose = require("mongoose");

// Define the post schema
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "" // URL of the post image
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId, // Store only reference IDs of comments for better scalability
      ref: "Comment",
    },
  ],
  hasLiked: {
    type: Boolean,
    default: false,
  },
  overallSentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    default: "neutral",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
