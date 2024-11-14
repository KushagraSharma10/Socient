// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// require('dotenv').config();


// const authenticateUser = (req, res, next) => {
//     const token = req.header('Authorization').replace('Bearer ', '');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = User.findById(decoded.id);

//     if (!user) {
//         return res.status(401).json({ message: 'Authentication failed' });
//     }

//     req.user = user;  // Attach user info to request
//     next();
// };

// module.exports = authenticateUser;

const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>" format
  console.log("JWT_SECRET:", process.env.JWT_KEY); // Check if JWT_SECRET is loaded

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id; // Directly store the user ID
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
