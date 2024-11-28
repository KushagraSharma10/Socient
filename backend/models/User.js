const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to other users
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // References to other users
    chatRooms: [{ type: String }], // Optional: Array of room IDs the user is part of
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
