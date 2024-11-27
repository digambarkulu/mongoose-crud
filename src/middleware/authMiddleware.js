const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

const authenticate = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Check if token is blacklisted
        const blacklisted = await BlacklistedToken.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: 'Access denied. Token is invalid.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Save user info for further use
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = authenticate;
