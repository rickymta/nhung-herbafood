import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { get, run } from "./db";
import { verifyPassword, hashPassword } from "./auth-hash";

export { verifyPassword, hashPassword };

export const SESSION_COOKIE = "tn_admin_session";
const SESSION_DAYS = 7;

export type AdminUser = { id: number; email: string; name: string; role: string };

export async function createSession(userId: number) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  run("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [
    token,
    userId,
    expires.toISOString(),
  ]);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) run("DELETE FROM sessions WHERE token = ?", [token]);
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const row = get<AdminUser & { expires_at: string }>(
    `SELECT u.id, u.email, u.name, u.role, s.expires_at
       FROM sessions s JOIN admin_users u ON u.id = s.user_id
      WHERE s.token = ?`,
    [token],
  );
  if (!row || new Date(row.expires_at) < new Date()) return null;
  return { id: row.id, email: row.email, name: row.name, role: row.role };
}

/** Use at the top of every admin server component / server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getCurrentAdmin();
  if (!user) redirect("/admin/login");
  return user;
}
