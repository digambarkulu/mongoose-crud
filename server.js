const express = require('express');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes'); // Import user routes
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Use Routes
app.use('/api', userRoutes); // Prefix all user routes with "/api"

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
