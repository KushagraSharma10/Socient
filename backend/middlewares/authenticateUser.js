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
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("Decoded Token:", decoded); // Log token details for debugging

    // Ensure the decoded token has the user ID
    if (!decoded.id) {
      return res.status(400).json({ message: 'Invalid token payload' });
    }

    req.userId = decoded.id;
    console.log("Authenticated user ID:", req.userId); // Log the authenticated user ID

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;



// const authenticateUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Authentication token missing' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     console.log("Decoded Token:", decoded); // Add this log
//     req.userId = decoded.id;
//     console.log("Authenticated user ID:", req.userId); // Add this log
//     next();
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     res.status(403).json({ message: 'Invalid or expired token' });
//   }
// };

module.exports = authenticateUser;

