// server/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/', (req, res) => {
  const { userName,registration} = req.body;
  if (!userName || !registration) {
    return res.status(400).json({ error: 'Name and registration number are required' });
  }

  const newUser = new User({ userName, registration });
  newUser.save((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save user data' });
    }
    res.status(200).json({ message: 'User data saved successfully' });
  });
});

module.exports = router;