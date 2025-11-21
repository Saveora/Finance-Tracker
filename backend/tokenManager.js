// backend/tokenManager.js

/**
 * Token manager for Setu access token whose expiry (exp) is inside the JWT payload.
 * - Fetches token using clientId + clientSecret
 * - Decodes JWT to read `exp` and sets expiry accordingly
 * - Refreshes proactively refreshBeforeMs before expiry
 * - Concurrency-safe: multiple callers while refresh in-flight wait for single refresh
 */

let cfg = {
  authUrl: process.env.SETU_AUTH_URL || 'https://orgservice-prod.setu.co/v1/users/login',
  clientId: process.env.SETU_CLIENT_ID,
  clientSecret: process.env.SETU_CLIENT_SECRET,
  refreshBeforeMs: 60 * 1000, // refresh 60s before exp by default
  fetchTimeoutMs: 15000
};

let cachedToken = null;     // the raw access token string (JWT)
let expiresAt = 0;         // epoch ms when token expires
let refreshPromise = null; // in-flight refresh promise

function init(opts = {}) {
  cfg = { ...cfg, ...opts };
}

/** Base64url decode helper to decode JWT parts */
function base64urlDecode(str) {
  // replace URL-safe chars, add padding
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString('utf8');
}

/** Parse exp (seconds) from JWT; returns epoch ms or null */
function parseExpiryFromJwt(jwt) {
  if (!jwt || typeof jwt !== 'string') return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(base64urlDecode(parts[1]));
    if (payload && payload.exp) {
      return Number(payload.exp) * 1000; // seconds -> ms
    }
    return null;
  } catch (err) {
    return null;
  }
}

/** Is cached token valid (considering refresh window)? */
function isTokenValid() {
  if (!cachedToken) return false;
  const now = Date.now();
  return now + (cfg.refreshBeforeMs || 0) < expiresAt;
}

/** Internal: perform login call and populate cachedToken & expiresAt */
async function fetchNewToken() {
  if (!cfg.clientId || !cfg.clientSecret) {
    throw new Error('tokenManager: SETU_CLIENT_ID and SETU_CLIENT_SECRET must be set');
  }

  const body = {
    clientId: cfg.clientId,
    secret: cfg.clientSecret,
    grant_type: "client_credentials"
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), cfg.fetchTimeoutMs);

  try {
    const res = await fetch(cfg.authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const txt = await res.text().catch(()=>'<no-body>');
      throw new Error(`tokenManager: auth request failed ${res.status} ${txt}`);
    }

    const j = await res.json().catch(()=>({}));
    // Setu usually returns { accessToken: "..." }
    const token = j.accessToken || j.access_token || j.token || (j.data && j.data.accessToken) || null;
    if (!token) {
      throw new Error('tokenManager: no access token in auth response: ' + JSON.stringify(j));
    }

    // read expiry from JWT if present
    let expMs = parseExpiryFromJwt(token);
    if (!expMs) {
      // fallback: treat as 30 minutes valid
      expMs = Date.now() + 30 * 60 * 1000;
    }

    // set cache
    cachedToken = token;
    expiresAt = expMs;
    return token;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Public: returns a valid token (refreshing if necessary).
 * Uses single-flight refresh to avoid multiple auth calls.
 */
async function getToken() {
  if (isTokenValid()) return cachedToken;

  // if refresh already in progress, wait for it
  if (refreshPromise) {
    await refreshPromise;
    if (!cachedToken) throw new Error('tokenManager: refresh failed');
    return cachedToken;
  }

  // start refresh
  refreshPromise = (async () => {
    try {
      const t = await fetchNewToken();
      return t;
    } finally {
      refreshPromise = null;
    }
  })();

  const token = await refreshPromise;
  return token;
}

/** Force refresh (clear cache and fetch) */
async function forceRefresh() {
  cachedToken = null;
  expiresAt = 0;
  return await getToken();
}

/** For debugging only */
function _debug() {
  return { cachedTokenSnippet: cachedToken ? cachedToken.slice(0,8) + '...' : null, expiresAt, now: Date.now() };
}

module.exports = {
  init,
  getToken,
  forceRefresh,
  _debug
};
