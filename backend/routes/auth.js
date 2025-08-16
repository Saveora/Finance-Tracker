// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  refresh,
  logout
} = require('../controllers/authcontroller');

// Public auth routes
router.post('/signup', signup);
router.post('/login', login);

// Token rotation / refresh (expects refresh token cookie)
router.post('/refresh', refresh);

// Logout (revokes current refresh session cookie)
router.post('/logout', logout);

module.exports = router;
