"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Re-renders the current server page every few seconds. Used on the success page
 * while we wait for Stripe's webhook to record the purchase (usually 1–3 seconds).
 */
export default function RefreshPoller({ intervalMs = 3000, maxAttempts = 20 }: { intervalMs?: number; maxAttempts?: number }) {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const id = setInterval(() => {
      attempts += 1;
      if (attempts > maxAttempts) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs, maxAttempts]);

  return null;
}
