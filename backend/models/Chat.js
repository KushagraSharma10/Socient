const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" , required: true},
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false } // Prevent automatic `_id` creation for messages
);

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users in the chat
    messages: [messageSchema], // Array of messages
    updatedAt: { type: Date, default: Date.now }, // Last updated time
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt`
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
