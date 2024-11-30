const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Initiator of the action
  type: { type: String, enum: ['follow', 'like', 'comment', 'requested'], required: true }, // Type of notification
  message: { type: String, required: true }, // Notification message
  isRead: { type: Boolean, default: false }, // Read/unread status
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
