const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens



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

// Create a user
const createUser = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        
        const user = new User({ name, email, password, address });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        
        res.status(500).json({ message: 'Failed to create user', error: error.message });
    }
};

// For displaying all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
};

// For delete a single user
const deleteUser = async (req, res) => {
    const { id } = req.params; // User ID from URL parameters

    console.log("User ID: ", id);
    // exit();

    try {
        const user = await User.findByIdAndDelete(id); // Delete user by ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    const { id } = req.params; // User ID from URL parameters
    const { name, email, password, address } = req.body; // Fields to update

    try {
        // Find user by ID and update with new data
        const user = await User.findByIdAndUpdate(
            id,
            { name, email, password, address },
            { new: true, runValidators: true } // Return updated user, validate updates
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
};



module.exports = {loginUser, getAllUsers, createUser, deleteUser, updateUser };
