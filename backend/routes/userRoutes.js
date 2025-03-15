const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Fetch all users
router.get('/users', authMiddleware, userController.getAllUsers);

// Delete user
router.delete('/users/:id', authMiddleware, userController.deleteUser);

// Reset user password
router.put('/users/:id/reset-password', authMiddleware, userController.resetUserPassword);

// Update user role
router.put('/users/:id/update-role', authMiddleware, userController.updateUserRole);

module.exports = router;