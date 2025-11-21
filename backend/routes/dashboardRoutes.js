// backend/routes/dashboardRoutes.js
const express = require('express');
const { summary } = require('../controllers/dashboardController');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

// GET /api/dashboard/summary
router.get('/summary', requireAuth, summary);

module.exports = router;
