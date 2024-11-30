const Chat = require('../models/Chat');
const User = require('../models/User');

const fetchChats = async (req, res) => {
  try {
    const userId = req.userId; // Assuming authentication middleware provides the user object
    const chats = await Chat.find({ participants: userId }).populate(
      "participants",
      "username profilePicture"
    );
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const specificChats = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate(
      "messages.sender",
      "username profilePicture"
    );
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    const newMessage = { sender: userId, content };
    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  fetchChats,
  specificChats,
  sendMessage,
};
