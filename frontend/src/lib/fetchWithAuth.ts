// src/lib/fetchWithAuth.ts
import { getAccessToken, setAccessToken, attemptRefresh } from "./auth";

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  // single-flight refresh (re-uses attemptRefresh which you already have)
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        // attemptRefresh calls /refresh and sets access token if successful
        return await attemptRefresh();
      } catch (err) {
        console.error("doRefresh error", err);
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function isIdempotentMethod(method?: string) {
  const m = (method || "GET").toUpperCase();
  return m === "GET" || m === "HEAD" || m === "OPTIONS";
}

/**
 * fetchWithAuth:
 * - attaches Authorization header if access token exists
 * - always sends credentials: 'include' to allow refresh cookie
 * - if response is 401 and request is idempotent, attempts refresh and retries once
 * - if refresh fails, redirect to login (so callers don't have to)
 */
export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  // Build headers preserving any provided headers
  const headers = new Headers(init.headers || {});
  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = (init.method || (typeof input === "string" ? "GET" : (input as Request).method)).toUpperCase();

  const baseInit: RequestInit = {
    ...init,
    headers,
    credentials: "include",
  };

  // First attempt (catch network errors separately)
  let res: Response;
  try {
    res = await fetch(input, baseInit);
  } catch (err) {
    // network error -> bubble up
    throw err;
  }

  // If not 401 or request non-idempotent, return (no refresh/ retry)
  if (res.status !== 401 || !isIdempotentMethod(method)) return res;

  // Try refresh (single-flight)
  const refreshed = await doRefresh();
  if (!refreshed) {
    // Refresh failed -> immediate redirect to login because session can't be recovered
    try {
      // Use window.location so this works from any JS module (hooks/components might not have router)
      window.location.href = "/auth?type=login";
    } catch (e) {
      // fallback no-op
    }
    return res; // still return the original 401 response (caller won't use it)
  }

  // Retry once with new token
  const newToken = getAccessToken();
  if (newToken) headers.set("Authorization", `Bearer ${newToken}`);

  // For safety, create new headers object to avoid mutation side-effects
  const retryHeaders = new Headers(headers);

  return fetch(input, { ...baseInit, headers: retryHeaders });
}
