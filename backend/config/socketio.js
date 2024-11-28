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

        // User joins a personal room based on their user ID
        socket.on('join', (userId) => {
            console.log(`User joined room: ${userId}`);
            socket.join(userId);
        });

        // Real-time messaging: Join a specific chat room
        socket.on('join-room', (roomId) => {
            console.log(`Socket ${socket.id} joined room: ${roomId}`);
            socket.join(roomId);
        });

        // Listen for messages and broadcast them to the room
        socket.on('send-message', ({ roomId, senderId, message }) => {
            const chatMessage = {
                senderId,
                message,
                timestamp: new Date(),
            };
            console.log(`Message sent to room ${roomId}:`, chatMessage);
            io.to(roomId).emit('receive-message', chatMessage);
        });

        // Handle client disconnect
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
