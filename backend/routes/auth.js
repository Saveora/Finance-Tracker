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

// routes/auth.js (Option A - strict)
const crypto = require('crypto');
const argon2 = require('argon2');
const db = require('../db');
const { sendPasswordResetEmail } = require('../lib/mailer');

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
      // Explicit: user does not exist
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const user = userRes.rows[0];
    const userId = user.id;

    // generate token + hashed version
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // check for existing auth_credentials row
    const credRes = await db.query(
      `SELECT id FROM auth_credentials WHERE user_id = $1 LIMIT 1`,
      [userId]
    );

    if (credRes.rowCount === 0) {
      // Explicit: credentials missing -> ask to contact support (do NOT auto-create)
      return res.status(500).json({
        message: 'Account credentials not found. Please contact support to reset your password.'
      });
    }

    // update the existing auth_credentials row with reset token + expiry
    await db.query(
      `UPDATE auth_credentials
       SET reset_password_token = $1,
           reset_password_expires = now() + interval '30 minutes'
       WHERE user_id = $2`,
      [hashedToken, userId]
    );

    // send reset email (best effort; don't fail the route if mailer errors)
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

    // Find the auth_credentials row that matches the token and is not expired.
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

    // Hash new password with argon2 (recommended)
    const newHash = await argon2.hash(password, { type: argon2.argon2id });

    // Update password hash, clear token and expiry
    await db.query(
      `UPDATE auth_credentials
       SET password_hash = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2`,
      [newHash, auth_id]
    );

    // Revoke existing sessions (optional but recommended)
    await db.query(
      `UPDATE user_sessions
       SET revoked = true, last_used_at = now()
       WHERE user_id = $1 AND revoked = false`,
      [user_id]
    );

    function clearRefreshCookie(res) {
  // match the cookie name/opts used when setting the cookie elsewhere in your app
  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

clearRefreshCookie(res);

    // Optionally: you can log this event (time, IP, user_agent) for audit.
    return res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    console.error('reset-password error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
