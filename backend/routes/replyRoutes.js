// routes/replyRoutes.js
const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new reply (accessible to all users)
router.post('/replies', authMiddleware, replyController.createReply);

// Get all replies (accessible to all users)
router.get('/replies', replyController.getReplies);

// Edit a reply (restricted to admins)
router.put('/replies/:id', authMiddleware, replyController.editReply);

// Delete a reply (restricted to admins)
router.delete('/replies/:id', authMiddleware, replyController.deleteReply);

module.exports = router;