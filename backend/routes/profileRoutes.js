const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

// User profile route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
      const user = await User.findById(req.user.id).select('-password'); // Password exclude kare
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user); // User data send kare
  } catch (err) {
      res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Add interests route
router.post('/add-interests', authMiddleware, async (req, res) => {
  const { interests } = req.body;
  try {
      const user = await User.findById(req.user.id);
      user.interests = interests; // Interests update karo
      await user.save(); // User save karo
      res.status(200).json({ message: 'Interests updated successfully!', user });
  } catch (err) {
      res.status(500).json({ message: 'Error updating interests', error: err.message });
  }
});

module.exports = router;