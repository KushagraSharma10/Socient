const express = require('express');
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser")

const { fetchChats, specificChats, sendMessage, createChat } = require('../controllers/messengerController');

// Fetch all chats for the logged-in user
router.get('/chats',  authenticateUser , fetchChats);

// Fetch messages of a specific chat
router.get('/chats/:chatId',  authenticateUser ,specificChats);

// Send a new message
router.post('/chats/:chatId/messages', authenticateUser , sendMessage);

// create a new chat
router.post('/chats', authenticateUser, createChat);




module.exports = router;
