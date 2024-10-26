const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;  // Attach user info to request
    next();
};

module.exports = authenticateUser;
