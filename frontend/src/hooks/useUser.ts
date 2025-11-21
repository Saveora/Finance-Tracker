//frontend/src/hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { getAccessToken, attemptRefresh } from "@/lib/auth";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      setLoading(true);

      try {
        // ⚡ Step 1: Fast local check — if no token, redirect instantly
        const token = getAccessToken();
        if (!token) {
          router.replace("/auth?type=login");
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return; // stop further execution
        }

        // ⚡ Step 2: Try fetching user info using the token
        const res = await fetchWithAuth(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          const me =
            data.user ??
            (localStorage.getItem("me")
              ? JSON.parse(localStorage.getItem("me")!)
              : null);
          setUser(me);
        } else if (res.status === 401) {
          // ⚡ Step 3: Token invalid — attempt refresh once
          const refreshed = await attemptRefresh();
          if (refreshed) {
            const retryRes = await fetchWithAuth(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`,
              {
                method: "GET",
                credentials: "include",
              }
            );
            if (retryRes.ok) {
              const data = await retryRes.json().catch(() => ({}));
              setUser(data.user);
              setLoading(false);
              return;
            }
          }
          // refresh failed → logout
          router.replace("/auth?type=login");
          setUser(null);
        } else {
          router.replace("/auth?type=login");
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
        router.replace("/auth?type=login");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  return { user, loading };
}
