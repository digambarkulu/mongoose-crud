const BlacklistedToken = require('../models/BlacklistedToken');
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');

// User login (for generating JWT token)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const user = await User.findOne({ email });
        
        // Check if the user exists and password matches
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate an access JWT token (expires in 1 hour)
        const accessToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key (from .env)
            { expiresIn: '1h' } // Token expiry time (1 hour)
        );

        // Generate a refresh JWT token (expires in 7 days)
        const refreshToken = jwt.sign(
            { id: user._id, name: user.name, email: user.email }, // Payload
            process.env.JWT_SECRET, // Secret key (from .env)
            { expiresIn: '7d' } // Token expiry time (7 days)
        );

        // Send both tokens in the response
        res.status(200).json({
            message: 'Login successful',
            accessToken, // Access token for secure routes
            refreshToken // Refresh token to get a new access token
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
};

// Logout API
const logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is required for logout' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is already blacklisted
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(400).json({ message: 'Token is already blacklisted' });
        }

        // Add the token to the blacklist
        const expiresAt = new Date(decoded.exp * 1000); // Convert expiration time to a date
        await BlacklistedToken.create({ token, expiresAt });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // Handle invalid tokens
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Other errors
        res.status(500).json({ message: 'Failed to logout', error: error.message });
    }
};


module.exports = {loginUser, logoutUser };