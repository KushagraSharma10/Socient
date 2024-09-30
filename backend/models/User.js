const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type: String,
  },
  bio: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure that usernames are unique
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that emails are unique
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://via.placeholder.com/150", // Default profile picture
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
