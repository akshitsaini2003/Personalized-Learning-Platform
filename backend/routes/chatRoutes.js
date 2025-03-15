// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send-message', authMiddleware, chatController.sendMessage);
router.get('/get-messages', authMiddleware, chatController.getMessages);
router.delete('/delete-message/:messageId', authMiddleware, chatController.deleteMessage);

module.exports = router;