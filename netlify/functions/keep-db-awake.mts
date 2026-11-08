import postgres from "postgres";

/**
 * Netlify Scheduled Function: runs once a day.
 *
 * Supabase pauses free-plan projects after 7 days without database activity.
 * While the shop has few visitors, this tiny daily read keeps the project active.
 * Safe to delete if you upgrade Supabase to a paid plan.
 */
export default async function keepDbAwake() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("[keep-db-awake] DATABASE_URL is not set");
    return;
  }

  const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 10 });
  try {
    const [row] = await sql<{ videos: number }[]>`select count(*)::int as videos from videos`;
    console.info(`[keep-db-awake] ok, ${row.videos} video product(s)`);
  } catch (error) {
    console.error("[keep-db-awake] database query failed", error);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

export const config = {
  schedule: "@daily",
};
