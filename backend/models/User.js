const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
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
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other users who are following this user
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to other users that this user is following
    },
  ],
  followRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    },
  ],

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Reference to posts created by the user
    },
  ],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],

  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat', // Reference to chat documents where the user is a participant
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
