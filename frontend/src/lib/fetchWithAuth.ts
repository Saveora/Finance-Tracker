// src/lib/fetchWithAuth.ts
import { getAccessToken, setAccessToken } from "./auth";

let refreshPromise: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch("http://localhost:5000/refresh", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) return false;
        const data = await res.json().catch(() => ({}));
        if (data && data.accessToken) {
          setAccessToken(data.accessToken);
          (window as any).__ACCESS_TOKEN__ = data.accessToken;
          return true;
        }
        return false;
      } catch (err) {
        console.error("refresh failed", err);
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
  if (!refreshed) return res;

  // Retry once with new token
  const newToken = getAccessToken();
  if (newToken) headers.set("Authorization", `Bearer ${newToken}`);

  // For safety, create new headers object to avoid mutation side-effects
  const retryHeaders = new Headers(headers);

  return fetch(input, { ...baseInit, headers: retryHeaders });
}
