// backend/setuFetch.js

const tokenManager = require('./tokenManager');

async function fetchWithSetu(url, opts = {}) {
  // ensure headers object
  opts.headers = opts.headers ? { ...opts.headers } : {};

  // get token (refreshes if needed)
  let token = await tokenManager.getToken();
  opts.headers.Authorization = `Bearer ${token}`;

  let res = await fetch(url, opts);
  if (res.status === 401) {
    // token might have expired earlier than expected - force refresh and retry once
    try {
      console.warn('[fetchWithSetu] 401 - forcing token refresh and retrying', url);
      token = await tokenManager.forceRefresh();
      opts.headers.Authorization = `Bearer ${token}`;
      res = await fetch(url, opts);
    } catch (err) {
      // fall-through
    }
  }
  return res;
}

module.exports = fetchWithSetu;
