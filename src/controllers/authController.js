const BlacklistedToken = require('../models/BlacklistedToken');
const jwt = require('jsonwebtoken');

const logoutUser = async (req, res) => {
    try {
        // Get the token from headers
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ message: 'Token not provided' });
        }

        // Decode the token to get its expiry time
        const decoded = jwt.decode(token);
        if (!decoded) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Save the token to the blacklist
        const expiresAt = new Date(decoded.exp * 1000); // Convert expiry to milliseconds
        const blacklistedToken = new BlacklistedToken({ token, expiresAt });
        await blacklistedToken.save();

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to logout', error: error.message });
    }
};

module.exports = { logoutUser };
