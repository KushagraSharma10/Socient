const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500, // Limit content length
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  images: [
    {
      type: String, // URL of the post images
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  overallSentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    default: "neutral", // Ensure default is set
  required: true // Add this to enforce value
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Joi Validation Schema
const validatePost = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    content: Joi.string().trim().max(500).required(),
    images: Joi.array().items(Joi.string().uri()), // Ensure valid image URLs
  });

  return schema.validate(data);
};

const Post = mongoose.model("Post", postSchema);

module.exports = { Post, validatePost };
