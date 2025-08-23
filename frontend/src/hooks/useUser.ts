// src/hooks/useUser.ts
"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchUser() {
      setLoading(true);
      try {
        // fetchWithAuth will include Authorization (if available),
        // attempt refresh on 401, and retry once.
        const res = await fetchWithAuth("http://localhost:5000/api/me", {
          method: "GET",
        });

        if (!mounted) return;

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          // Prefer server response but fallback to cached 'me'
          const me = data.user ?? (localStorage.getItem("me") ? JSON.parse(localStorage.getItem("me")!) : null);
          setUser(me);
        } else {
          // Not authorized or failed after refresh -> no user
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
