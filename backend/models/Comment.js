const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300, // Limit comment length
  },
  userDp: {
    type: String,
    default: "https://via.placeholder.com/50",
  },
  sentiment: {
    type: String,
    enum: ["positive", "negative", "neutral"],
    default: "neutral",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Joi Validation Schema
const validateComment = (data) => {
  const schema = Joi.object({
    postId: Joi.string().hex().length(24).required(), // ✅ Ensures valid MongoDB ObjectId
    userId: Joi.string().hex().length(24).required(), // ✅ Ensures valid MongoDB ObjectId
    content: Joi.string().trim().max(300).required(),
    userDp: Joi.string().uri(),
  });

  return schema.validate(data);
};

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, validateComment };
