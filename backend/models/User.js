const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 250, // Limit bio length
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  profilePicture: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    },
  ],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);


// Joi Validation Schema
const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50),
    bio: Joi.string().trim().max(250),
    username: Joi.string().trim().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    profilePicture: Joi.string().uri(),
  });

  return schema.validate(data);
};


module.exports = { User, validateUser };
