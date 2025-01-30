const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["follow", "like", "comment", "requested"], required: true },
  message: { type: String, required: true, trim: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Joi Validation Schema
const validateNotification = (data) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    sender: Joi.string().required(),
    type: Joi.string().valid("follow", "like", "comment", "requested").required(),
    message: Joi.string().trim().max(250).required(),
  });

  return schema.validate(data);
};

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = { Notification, validateNotification };
