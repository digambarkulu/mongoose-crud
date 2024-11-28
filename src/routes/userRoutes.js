const express = require('express');
const { getAllUsers, getSngleUser, createUser, deleteUser, updateUser  } = require('../controllers/userController'); // Import controller
const { loginUser, logoutUser } = require('../controllers/authController'); 
const router = express.Router();

// Define routes
router.get('/users', getAllUsers); // Route to get all users
router.get('/users/:id', getSngleUser); // Route to get single user
router.post('/users', createUser); // Route to create a new user
router.delete('/users/:id', deleteUser); // Route to delete a user by ID
router.put('/users/:id', updateUser); // Route to update a user by ID
router.post('/login', loginUser); // Route for user login
router.post('/logout', logoutUser); // Route for user login

module.exports = router;
