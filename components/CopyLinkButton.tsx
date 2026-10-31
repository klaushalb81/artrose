"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <button type="button" className="btn" onClick={copy}>
      {state === "copied" ? "Kopiert!" : state === "failed" ? "Kunne ikke kopiere" : "Kopier lenken"}
    </button>
  );
}
