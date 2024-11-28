const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true }, // Chat room ID
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
    message: { type: String, required: true }, // Message content
    messageType: { type: String, enum: ['text', 'image', 'file'], default: 'text' }, // Type of message
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Call Log Schema
const callLogSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }], // References to the User model
    callType: { type: String, enum: ['audio', 'video'], required: true }, // Type of call
    startTime: { type: Date, required: true }, // Call start time
    endTime: { type: Date }, // Call end time
    status: { type: String, enum: ['completed', 'missed', 'ongoing'], default: 'ongoing' }, // Call status
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
const CallLog = mongoose.model('CallLog', callLogSchema);

module.exports = { Message, CallLog };
