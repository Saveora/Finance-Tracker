// src/lib/auth.ts
// small client-side helper for access token + automatic refresh call

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch (err) {
    return null;
  }
}

export function setAccessToken(token: string) {
  try {
    localStorage.setItem('accessToken', token);
  } catch (err) {
    // ignore
  }
}

export function clearAccessToken() {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('me');
    (window as any).__ACCESS_TOKEN__ = undefined;
  } catch (err) {
    // ignore
  }
}

/**
 * attemptRefresh
 * - Calls POST /refresh (cookie included)
 * - If server returns a new accessToken, stores it and returns true.
 */
export async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
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
    console.error('Refresh attempt failed', err);
    return false;
  }
}
