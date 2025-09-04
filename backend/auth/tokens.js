// auth/tokens.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_PEPPER = process.env.REFRESH_TOKEN_PEPPER || 'replace_me';

// Ensure required env
if (!JWT_SECRET) {
  console.error('JWT_SECRET env missing');
  process.exit(1);
}

/**
 * Sign a short-lived access token (JWT).
 * - include sub (user id) in payload as caller already does
 * - explicitly set algorithm for clarity
 */
function signAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
}

/**
 * Verify access token, return decoded payload or null.
 * If expired, we return null (caller can treat as unauthorized).
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    // Do not leak details to client here; let middleware decide message
    return null;
  }
}

/**
 * Create a cryptographically-strong opaque refresh token.
 * Using hex is fine; base64url can be used if you prefer shorter strings.
 */
function createRefreshToken() {
  return crypto.randomBytes(64).toString('hex'); // 128 hex chars (~512 bits)
}

/**
 * Hash a refresh token for storage using HMAC-SHA256 with a server-only pepper.
 * Storing HMAC result prevents raw token leakage from DB dumps.
 */
function hashRefreshToken(refreshToken) {
  return crypto.createHmac('sha256', REFRESH_PEPPER).update(refreshToken).digest('hex');
}

/**
 * Return a JS Date when a refresh token should expire.
 * Exported name matches controller's import (refreshExpiresAt).
 */
function refreshExpiresAt(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshExpiresAt, // important: name matches controllers
};
