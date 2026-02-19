const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ PUBLIC ROUTE - NO AUTH (for tracking all visitors)
router.post('/track', visitorController.trackVisitor);

// ✅ PROTECTED ROUTES - WITH AUTH (for counselor dashboard)
router.get('/stats', authMiddleware, visitorController.getVisitorStats);
router.get('/today', authMiddleware, visitorController.getTodayVisitors);

module.exports = router;