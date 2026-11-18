import postgres from "postgres";

/**
 * Netlify Scheduled Function: runs once a day.
 *
 * Supabase pauses free-plan projects after 7 days without activity. Queries
 * through the connection pooler alone don't seem to count, so this job also
 * calls the Supabase Data API (`keepalive_ping`, see
 * db/migrations/003_keepalive_ping.sql) — an API request, which does count.
 *
 * Env: DATABASE_URL, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY.
 * Safe to delete if you upgrade Supabase to a paid plan.
 */
export default async function keepDbAwake() {
  const results = await Promise.allSettled([pingDataApi(), pingDatabase()]);
  const failed = results.filter((r) => r.status === "rejected");
  for (const r of failed) console.error("[keep-db-awake]", (r as PromiseRejectedResult).reason);
  if (failed.length > 0) throw new Error(`[keep-db-awake] ${failed.length} of 2 checks failed`);
}

async function pingDataApi() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not set");

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/keepalive_ping`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(15_000),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Data API ping failed: HTTP ${response.status} ${body.slice(0, 200)}`);
  console.info(`[keep-db-awake] Data API ok: ${body}`);
}

async function pingDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10 });
  try {
    const [row] = await sql<{ videos: number }[]>`select count(*)::int as videos from videos`;
    console.info(`[keep-db-awake] database ok, ${row.videos} video(s)`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export const config = {
  schedule: "@daily",
};
