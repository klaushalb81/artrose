import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionValue,
  deriveSessionKey,
  passwordMatches,
  verifySessionValue,
} from "./admin-session";
import { adminEnv, env } from "./env";

function sessionKey(): Buffer {
  return deriveSessionKey(adminEnv().ADMIN_PASSWORD, env().VIEWING_TOKEN_ENCRYPTION_KEY);
}

/** True if the current request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionValue(sessionKey(), value);
}

/** Call at the top of every admin page and every admin Server Action / route. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function startAdminSession(password: string): Promise<boolean> {
  if (!passwordMatches(password, adminEnv().ADMIN_PASSWORD)) return false;
  (await cookies()).set(ADMIN_SESSION_COOKIE, createSessionValue(sessionKey()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return true;
}

export async function endAdminSession(): Promise<void> {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
}
