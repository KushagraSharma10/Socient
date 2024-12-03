const Chat = require('../models/Chat');
const User = require('../models/User');

const fetchChats = async (req, res) => {
  try {
    const userId = req.userId; // Assuming authentication middleware provides this
    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username profilePicture")
      .populate("messages.sender", "username profilePicture") // Populate sender info for the last message
      .sort({ updatedAt: -1 }) // Sort by the most recently updated chat
      .lean(); // Convert to plain JavaScript objects for easier manipulation

    // Add the last message to each chat
    const chatsWithLastMessage = chats.map((chat) => ({
      ...chat,
      lastMessage: chat.messages[chat.messages.length - 1], // Retrieve the last message
    }));

    res.status(200).json(chatsWithLastMessage);
  } catch (err) {
    console.error("Error fetching chats:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};


const specificChats = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Find the chat and populate messages
    const chat = await Chat.findById(chatId)
      .populate("participants", "username profilePicture") // Populate participants
      .populate("messages.sender", "username profilePicture") // Populate sender info for messages
      .lean();

    if (!chat) return res.status(404).json({ error: "Chat not found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching specific chat:", err.message);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    // Find the chat by ID
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // Create a new message object
    const newMessage = { sender: userId, content };
    chat.messages.push(newMessage);

    // Update the chat's last updated time
    chat.updatedAt = new Date();
    await chat.save();

    // Emit the message to other participants
    if (io) {
      io.to(chatId).emit("receiveMessage", { ...newMessage, chatId });
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ error: "Failed to send message" });
  }
};



module.exports = {
  fetchChats,
  specificChats,
  sendMessage,
};
