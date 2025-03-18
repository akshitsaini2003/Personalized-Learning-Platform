// routes/threadRoutes.js
const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a new thread (accessible to all users)
router.post('/threads', authMiddleware, threadController.createThread);

// Get all threads (accessible to all users)
router.get('/threads', threadController.getThreads);

// Edit a thread (restricted to admins)
router.put('/threads/:id', authMiddleware, threadController.editThread);

// Delete a thread (restricted to admins)
router.delete('/threads/:id', authMiddleware, threadController.deleteThread);

// Like a thread (accessible to all users)
router.post('/threads/:id/like', authMiddleware, threadController.likeThread);

module.exports = router;