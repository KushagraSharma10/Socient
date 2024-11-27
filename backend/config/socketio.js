// socket.js
let io;

const initializeSocket = (server) => {
    const socketIo = require('socket.io');
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000", // Frontend origin
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
