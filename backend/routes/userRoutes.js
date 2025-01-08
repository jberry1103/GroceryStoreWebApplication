// backend/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Route to add a new user
router.post('/add', async (req, res) => {
  const { name, email } = req.body;

  // Check if data is valid
  if (!name || !email) {
    console.log('Missing name or email');
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: 'Error adding user', error: err.message });
  }
});

module.exports = router;

