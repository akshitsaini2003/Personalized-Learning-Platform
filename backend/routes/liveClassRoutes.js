const express = require('express');
const router = express.Router();
const liveClassController = require('../controllers/liveClassController');
const authMiddleware = require('../middlewares/authMiddleware'); // Admin auth middleware

// ✅ **Admin: Live Class Add Kare**
router.post('/add-live-class', authMiddleware, liveClassController.addLiveClass);

// ✅ **User: Sirf Admin ki Add Ki Hui Classes Dekhe**
router.get('/live-classes',authMiddleware, liveClassController.getLiveClasses);

// ✅ **Admin: Live Class Edit Kare**
router.put('/live-classes/:id', authMiddleware, liveClassController.editLiveClass);

// ✅ **Admin: Live Class Delete Kare**
router.delete('/live-classes/:id', authMiddleware, liveClassController.deleteLiveClass);

module.exports = router;