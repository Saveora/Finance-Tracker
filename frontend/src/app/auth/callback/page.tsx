// frontend/src/app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Use your helper so storage key is consistent across the app
      setAccessToken(token);

      // Remove token from URL so it won't stay in history or be leaked
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // redirect to dashboard (use replace so user can't go "back" to the token url)
      router.replace("/dashboard");
    } else {
      router.replace("/auth?error=google_failed");
    }
  }, [router]);

  return <p>Signing you in with Google…</p>;
}
