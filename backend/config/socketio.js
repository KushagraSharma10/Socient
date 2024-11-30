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
        socket.on('sendMessage', ({ chatId, message }) => {
          io.to(chatId).emit('newMessage', message); // Broadcast to all users in the chat room
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
