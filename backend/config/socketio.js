const Chat = require('../models/Chat');

let io;

const initializeSocket = (server) => {
    const socketIo = require('socket.io');
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173", // Frontend origin
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
    
        // Join a chat room
        socket.on('joinChat', (chatId) => {
          socket.join(chatId);
          console.log(`User joined chat: ${chatId}`);
        });
    
        // Handle sending a message
        socket.on('sendMessage', async ({ chatId, message }) => {
          try {
            const chat = await Chat.findById(chatId);
            if (!chat) return;
        
            const newMessage = {
              sender: message.sender,
              content: message.content,
              createdAt: new Date(),
            };
        
            chat.messages.push(newMessage);
            chat.updatedAt = new Date();
            await chat.save();
        
            // Broadcast message to other participants
            socket.to(chatId).emit('receiveMessage', { ...newMessage, chatId });
          } catch (error) {
            console.error('Error saving message:', error.message);
          }
        });
        
        
    
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
        });
      });
    };
    const emitNotification = (userId, notificationData) => {
    if (io) {
        io.to(userId).emit('notification', notificationData);
        console.log(`Notification emitted to user ${userId}`);
    }
};

module.exports = {
    initializeSocket,
    emitNotification
};
