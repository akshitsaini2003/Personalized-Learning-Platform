const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

// Progress tracking route
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('progress'); // Progress data fetch kare
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.progress); // Progress data send kare
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.post('/quizzes/:id/submit', async (req, res) => {
  const { userId, score } = req.body;
  const user = await User.findById(userId);
  user.points += score;
  await user.save();
  res.json({ message: 'Points updated successfully!' });
});

module.exports = router;