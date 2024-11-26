const express = require('express');
const { getAllUsers, createUser, deleteUser, updateUser, loginUser } = require('../controllers/userController'); // Import controller
const router = express.Router();

// Define routes
router.get('/users', getAllUsers); // Route to get all users
router.post('/users', createUser); // Route to create a new user
router.delete('/users/:id', deleteUser); // Route to delete a user by ID
router.put('/users/:id', updateUser); // Route to update a user by ID
router.post('/login', loginUser); // Route for user login

module.exports = router;
