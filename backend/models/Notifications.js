const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Recipient
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who initiated the action
    type: { type: String, enum: ["follow"], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
