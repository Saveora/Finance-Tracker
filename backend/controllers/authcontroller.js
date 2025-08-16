// controllers/authcontroller.js
const argon2 = require('argon2');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { pool, query } = require('../db');
const {
  signAccessToken,
  createRefreshToken,
  hashRefreshToken,
  refreshExpiresAt
} = require('../auth/tokens');

const COOKIE_OPTIONS_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'lax',
  path: '/',
};

function errRes(res, status = 400, message = 'Bad Request') {
  return res.status(status).json({ ok: false, error: message });
}

/**
 * POST /auth/signup
 */
async function signup(req, res) {
  const { email, password, name, phone } = req.body || {};

  if (!email || !password || !name || !phone) {
    return errRes(res, 400, 'email, password, name and phone are required');
  }
  if (String(password).length < 8) {
    return errRes(res, 400, 'Password must be at least 8 characters');
  }

  const emailNorm = String(email).trim().toLowerCase();
  const nameNorm = String(name).trim();

  const pn = parsePhoneNumberFromString(String(phone), 'IN');
  if (!pn || !pn.isValid()) {
    return errRes(res, 400, 'Invalid phone number');
  }
  const phoneE164 = pn.number;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertUserText = `
      INSERT INTO users (email, name, phone)
      VALUES ($1, $2, $3)
      RETURNING id, email, name, phone, created_at
    `;
    const userRes = await client.query(insertUserText, [emailNorm, nameNorm, phoneE164]);
    const user = userRes.rows[0];

    // Argon2id with default secure params (tunable via environment if needed)
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    await client.query(
      `INSERT INTO auth_credentials (user_id, password_hash) VALUES ($1,$2)`,
      [user.id, passwordHash]
    );

    // create refresh token (opaque), store only hash
    const refreshToken = createRefreshToken();
    const refreshHash = hashRefreshToken(refreshToken);
    const expiresAt = refreshExpiresAt();

    await client.query(
      `INSERT INTO user_sessions (user_id, refresh_token_hash, ip, user_agent, expires_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [user.id, refreshHash, req.ip || null, req.get('User-Agent') || null, expiresAt]
    );

    await client.query('COMMIT');

    const accessToken = signAccessToken({ sub: user.id, email: user.email });

    // mark cookie options; ensure sameSite:none => secure:true in production
    const cookieOpts = {
      ...COOKIE_OPTIONS_BASE,
      expires: expiresAt,
    };

    res.cookie('refresh_token', refreshToken, cookieOpts);

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        created_at: user.created_at
      },
      accessToken
    });
  } catch (err) {
    await client.query('ROLLBACK');

    // Handle unique constraint violations gracefully
    if (err && err.code === '23505') {
      const detail = err.detail || '';
      if (detail.includes('email')) return errRes(res, 409, 'Email already in use');
      if (detail.includes('phone')) return errRes(res, 409, 'Phone already in use');
      return errRes(res, 409, 'User with provided identifier already exists');
    }

    // do not leak DB internals
    console.error('Signup error:', err && err.message ? err.message : err);
    return errRes(res, 500, 'Could not create user');
  } finally {
    client.release();
  }
}

/**
 * POST /auth/login
 */
async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return errRes(res, 400, 'email and password required');

  try {
    const userRes = await query('SELECT id, email FROM users WHERE email=$1', [String(email).trim().toLowerCase()]);
    if (userRes.rowCount === 0) return errRes(res, 401, 'Invalid credentials');
    const user = userRes.rows[0];

    const credRes = await query('SELECT password_hash FROM auth_credentials WHERE user_id=$1', [user.id]);
    if (credRes.rowCount === 0) return errRes(res, 401, 'Invalid credentials');

    const hash = credRes.rows[0].password_hash;
    const valid = await argon2.verify(hash, password);
    if (!valid) return errRes(res, 401, 'Invalid credentials');

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = createRefreshToken();
    const refreshHash = hashRefreshToken(refreshToken);
    const expiresAt = refreshExpiresAt();

    await query(
      `INSERT INTO user_sessions (user_id, refresh_token_hash, ip, user_agent, expires_at)
       VALUES ($1,$2,$3,$4,$5)`,
      [user.id, refreshHash, req.ip || null, req.get('User-Agent') || null, expiresAt]
    );

    const cookieOpts = {
      ...COOKIE_OPTIONS_BASE,
      expires: expiresAt,
    };

    res.cookie('refresh_token', refreshToken, cookieOpts);
    return res.json({ ok: true, accessToken });
  } catch (err) {
    console.error('Login error:', err && err.message ? err.message : err);
    return errRes(res, 500, 'Login failed');
  }
}

/**
 * POST /auth/refresh
 * Rotates refresh token atomically.
 */
async function refresh(req, res) {
  try {
    const cookie = req.cookies && req.cookies['refresh_token'];
    if (!cookie) return errRes(res, 401, 'No refresh token');

    const oldHash = hashRefreshToken(cookie);

    const newRefreshToken = createRefreshToken();
    const newHash = hashRefreshToken(newRefreshToken);
    const newExpires = refreshExpiresAt();

    // Atomic rotate: only updates if session exists and is valid
    const updateRes = await query(
      `UPDATE user_sessions
       SET refresh_token_hash = $1, last_used_at = now(), expires_at = $2
       WHERE refresh_token_hash = $3 AND revoked = false AND expires_at > now()
       RETURNING id, user_id`,
      [newHash, newExpires, oldHash]
    );

    if (updateRes.rowCount === 0) {
      // token not found or already expired/revoked
      return errRes(res, 401, 'Invalid or expired refresh token');
    }

    const session = updateRes.rows[0];

    const userRes = await query('SELECT id, email FROM users WHERE id=$1', [session.user_id]);
    if (userRes.rowCount === 0) return errRes(res, 401, 'Invalid session');

    const user = userRes.rows[0];
    const accessToken = signAccessToken({ sub: user.id, email: user.email });

    const cookieOpts = {
      ...COOKIE_OPTIONS_BASE,
      expires: newExpires,
    };

    res.cookie('refresh_token', newRefreshToken, cookieOpts);
    return res.json({ ok: true, accessToken });
  } catch (err) {
    console.error('Refresh error:', err && err.message ? err.message : err);
    return errRes(res, 500, 'Could not refresh token');
  }
}

/**
 * POST /auth/logout
 */
async function logout(req, res) {
  try {
    const cookie = req.cookies && req.cookies['refresh_token'];
    if (!cookie) return res.json({ ok: true });

    const providedHash = hashRefreshToken(cookie);
    await query('UPDATE user_sessions SET revoked = true WHERE refresh_token_hash = $1', [providedHash]);

    // Clear cookie with same options to ensure browser deletes it
    res.clearCookie('refresh_token', COOKIE_OPTIONS_BASE);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Logout error:', err && err.message ? err.message : err);
    return errRes(res, 500, 'Logout failed');
  }
}

module.exports = {
  signup,
  login,
  refresh,
  logout,
};
