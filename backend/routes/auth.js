// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  refresh,
  logout
} = require('../controllers/authcontroller');

const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../db');
const { sendPasswordResetEmail } = require('../lib/mailer');

// ✅ Google OAuth dependencies
const passport = require('passport');
require('../auth/google'); // loads Google strategy

// ================================
// Public auth routes (existing)
// ================================
router.post('/signup', signup);
router.post('/login', login);

// Token rotation / refresh (expects refresh token cookie)
router.post('/refresh', refresh);

// Logout (revokes current refresh session cookie)
router.post('/logout', logout);

// ================================
// Forgot / Reset Password (existing)
// ================================
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Missing email' });

  const normalized = String(email).trim().toLowerCase();

  try {
    const userRes = await db.query(
      `SELECT id, email, first_name, last_name, username
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [normalized]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const user = userRes.rows[0];
    const userId = user.id;

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const credRes = await db.query(
      `SELECT id FROM auth_credentials WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (credRes.rowCount === 0) {
      return res.status(500).json({
        message: 'Account credentials not found. Please contact support to reset your password.'
      });
    }

    await db.query(
      `UPDATE auth_credentials
       SET reset_password_token = $1,
           reset_password_expires = now() + interval '30 minutes'
       WHERE user_id = $2`,
      [hashedToken, userId]
    );

    const resetUrl = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (mailErr) {
      console.error('Mailer error (forgot-password):', mailErr);
    }

    return res.status(200).json({ message: 'Reset link sent (if account exists).' });
  } catch (err) {
    console.error('forgot-password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Invalid request' });

  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const credRes = await db.query(
      `SELECT ac.id AS auth_id, ac.user_id
       FROM auth_credentials ac
       WHERE ac.reset_password_token = $1
         AND ac.reset_password_expires IS NOT NULL
         AND ac.reset_password_expires > now()
       LIMIT 1`,
      [hashedToken]
    );

    if (credRes.rowCount === 0) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }

    const { auth_id, user_id } = credRes.rows[0];
    const newHash = await argon2.hash(password, { type: argon2.argon2id });

    await db.query(
      `UPDATE auth_credentials
       SET password_hash = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2`,
      [newHash, auth_id]
    );

    await db.query(
      `UPDATE user_sessions
       SET revoked = true, last_used_at = now()
       WHERE user_id = $1 AND revoked = false`,
      [user_id]
    );

    function clearRefreshCookie(res) {
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }

    clearRefreshCookie(res);

    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('reset-password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ================================
// Google OAuth (newly added)
// ================================

// Step 1: Redirect user to Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Step 2: Google redirects back here
// inside backend/routes/auth.js (replace the /auth/google/callback handler)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth?error=google_failed", session: false }),
  (req, res) => {
    // req.user now contains { user, accessToken, refreshToken, is_remember }
    const payload = req.user || {};
    const accessToken = payload.accessToken;
    const refreshToken = payload.refreshToken;
    const isRemember = payload.is_remember;

    if (!accessToken || !refreshToken) {
      return res.redirect(
        `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth?error=google_failed`
      );
    }

    // cookie base options (keep in sync with authcontroller COOKIE_OPTIONS_BASE)
    const cookieBase = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.COOKIE_SAMESITE || "lax",
      path: "/",
    };

    const cookieOpts = { ...cookieBase };
    if (isRemember) {
      // set persistent cookie to match server session expiry
      // We stored the expires_at in DB, so we can set a long expiry as well
      const days = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || "30", 10);
      cookieOpts.expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    // otherwise leave cookie as session cookie (no expires)

    // set refresh cookie (httpOnly)
    res.cookie("refresh_token", refreshToken, cookieOpts);

    // redirect to frontend callback route — include the short-lived access token in query param
    // Note: exposing access token in URL is convenient but not ideal. It's short-lived; the refresh cookie is httpOnly.
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/callback?token=${encodeURIComponent(
      accessToken
    )}`;

    return res.redirect(redirectUrl);
  }
);


module.exports = router;
