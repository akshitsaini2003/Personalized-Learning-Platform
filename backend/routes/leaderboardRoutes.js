const express = require('express');
const User = require('../models/User'); // User model import kare
const router = express.Router();

// Leaderboard fetch karne ka route
router.get('/leaderboard', async (req, res) => {
  try {
    // Users ko points ke hisab se sort kare (descending order)
    const users = await User.find().sort({ points: -1 }).limit(10); // Top 10 users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
});

module.exports = router;