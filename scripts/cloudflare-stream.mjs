#!/usr/bin/env node
/**
 * One-off Cloudflare Stream setup helper. Run locally, never deployed.
 *
 *   node scripts/cloudflare-stream.mjs create-key
 *       Creates a Stream signing key and prints the two env values you need:
 *       CLOUDFLARE_STREAM_SIGNING_KEY_ID and CLOUDFLARE_STREAM_SIGNING_KEY_PEM.
 *
 *   node scripts/cloudflare-stream.mjs require-signed <video-uid>
 *       Turns on "Require signed URLs" for a video so it can't be played without
 *       a token minted by our server.
 *
 *   node scripts/cloudflare-stream.mjs list
 *       Lists your videos (uid, name, requireSignedURLs) so you can copy UIDs.
 *
 * Needs env vars (put them in .env.local or pass inline):
 *   CLOUDFLARE_ACCOUNT_ID   – from the Cloudflare dashboard URL / Stream overview
 *   CLOUDFLARE_API_TOKEN    – API token with "Stream: Edit" permission
 */

import { readFileSync, existsSync } from "node:fs";

loadDotEnvLocal();

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !apiToken) {
  console.error("Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN first.");
  process.exit(1);
}

const base = `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`;
const [command, arg] = process.argv.slice(2);

try {
  switch (command) {
    case "create-key": {
      const result = await cf("POST", `${base}/keys`);
      console.log("\nAdd these to your environment (Netlify → Environment variables):\n");
      console.log(`CLOUDFLARE_STREAM_SIGNING_KEY_ID=${result.id}`);
      console.log(`CLOUDFLARE_STREAM_SIGNING_KEY_PEM=${result.pem}`);
      console.log("\nThe PEM is shown only once. Store it in your secrets manager, not in git.");
      break;
    }
    case "require-signed": {
      if (!arg) throw new Error("Usage: require-signed <video-uid>");
      const result = await cf("POST", `${base}/${arg}`, { requireSignedURLs: true });
      console.log(`Video ${result.uid} ("${result.meta?.name ?? ""}") now requires signed URLs: ${result.requireSignedURLs}`);
      break;
    }
    case "list": {
      const result = await cf("GET", `${base}?per_page=100`);
      for (const v of result) {
        console.log(`${v.uid}  signed=${v.requireSignedURLs ? "yes" : "NO "}  ${v.meta?.name ?? ""}`);
      }
      break;
    }
    default:
      console.error("Usage: node scripts/cloudflare-stream.mjs <create-key | require-signed <uid> | list>");
      process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

async function cf(method, url, body) {
  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(`Cloudflare API error: ${JSON.stringify(json.errors ?? json)}`);
  }
  return json.result;
}

/** Minimal .env.local loader so the script works without extra dependencies. */
function loadDotEnvLocal() {
  const file = new URL("../.env", import.meta.url);
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match || line.trim().startsWith("#")) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    process.env[match[1]] ??= value;
  }
}
