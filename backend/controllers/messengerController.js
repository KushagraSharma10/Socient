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

    if (!content) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found.' });
    }

    const newMessage = {
      sender: userId,
      content,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    chat.updatedAt = new Date();

    await chat.save();

    // Emit the message to other participants
    if (io) {
      io.to(chatId).emit('receiveMessage', { ...newMessage, chatId });
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err.message);
    res.status(500).json({ error: 'Failed to send message.' });
  }
};


const createChat = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    // Validate receiverId
    if (!receiverId || receiverId === senderId) {
      return res.status(400).json({ error: 'Invalid receiver ID.' });
    }

    // Check if a chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(200).json({ chatId: existingChat._id });
    }

    // Create a new chat
    const newChat = new Chat({
      participants: [senderId, receiverId],
      messages: [],
    });

    await newChat.save();

    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    console.error('Error creating chat:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const createNewChat = async (senderId, receiverId) => {
  try {
    if (!senderId || !receiverId) {
      throw new Error('Both senderId and receiverId are required to create a chat.');
    }

    const chat = new Chat({
      participants: [senderId, receiverId],
      messages: [],
    });

    await chat.save();
    return chat;
  } catch (err) {
    console.error('Error creating new chat:', err.message);
    throw err;
  }
};




module.exports = {
  fetchChats,
  specificChats,
  sendMessage,
  createChat,
  createNewChat,
};
