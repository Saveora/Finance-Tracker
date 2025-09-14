"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      router.push("/dashboard"); // redirect after login
    } else {
      router.push("/login?error=google_failed");
    }
  }, [router]);

  return <p>Signing you in with Google...</p>;
}
