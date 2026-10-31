import "server-only";
import postgres from "postgres";
import { env } from "./env";

/**
 * Postgres client (postgres.js), configured for serverless:
 *  - `prepare: false` is required for Supabase's transaction-mode pooler.
 *  - small pool, since each Netlify function instance is short-lived.
 *
 * All queries use the tagged template `sql\`...\``, which sends values as
 * bound parameters — never string-concatenate user input into SQL.
 */
const globalForDb = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

export function sql() {
  if (!globalForDb.__sql) {
    globalForDb.__sql = postgres(env().DATABASE_URL, {
      prepare: false,
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return globalForDb.__sql;
}
