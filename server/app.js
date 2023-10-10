const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors()); // Add this line to enable CORS for all routes
// Connect to MongoDB
mongoose.connect('mongodb+srv://Rajendra:12345@cgpa-evaluator.lx5wves.mongodb.net/CGPA-Evaluator?retryWrites=true&w=majority&ssl=true');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/users',userRoutes); // Use '/api/users' as the route for user-related API endpoints

// Start the server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
