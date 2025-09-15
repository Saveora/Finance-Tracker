// middlewares/requireAuth.js
const { verifyAccessToken } = require('../auth/tokens');
const { query } = require('../db');

module.exports = async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'No auth' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Bad auth' });

    const token = parts[1];
    const payload = verifyAccessToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    // Payload.sub should be the user id
    if (!payload.sub) return res.status(401).json({ error: 'Invalid token payload' });

    // optionally check user exists
    const userRes = await query(
  'SELECT id, email, display_name FROM users WHERE id=$1',
  [payload.sub]
);
    if (userRes.rowCount === 0) return res.status(401).json({ error: 'Unknown user' });

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    console.error('Auth middleware error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Authentication error' });
  }
};
