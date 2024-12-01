const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating JWT tokens



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

    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is required for getAllUser' });
    }

    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
};

// For fetching a single user

const getSngleUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is required for getSngleUser' });
    }

    try {
        const { id } = req.params; // User ID from URL parameters
        const user = await User.findById(id); // Fetch single user
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
    }
};


// For delete a single user
const deleteUser = async (req, res) => {

    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is required for deleteUser' });
    }

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
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(400).json({ message: 'Token is required for updateUser' });
    }

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



module.exports = {getAllUsers, getSngleUser, createUser, deleteUser, updateUser };
