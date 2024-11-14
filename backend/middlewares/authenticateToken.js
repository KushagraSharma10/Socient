const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_KEY);
        req.userId = user.id; // Extract user ID from JWT payload
        req.username = user.username; // Extract username from JWT if available
        next(); // Proceed to next middleware
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: "Forbidden" });
    }
};

module.exports = authenticateToken;
