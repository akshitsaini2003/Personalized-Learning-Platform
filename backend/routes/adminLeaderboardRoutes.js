// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin ke liye detailed leaderboard
router.get('/admin/leaderboard', authMiddleware, async (req, res) => {
  try {
    // Sirf admin access kar sake
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find()
      .populate({
        path: 'completedQuizzes.quiz',
        select: 'title', // Only fetch quiz title
        model: 'Quiz' // Explicitly specify the model
      })
      .sort({ points: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: err.message });
  }
});

// User points reset endpoint
router.put('/admin/reset-user/:userId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        points: 0,
        completedQuizzes: [] 
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User progress reset successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting user', error: err.message });
  }
});

module.exports = router;