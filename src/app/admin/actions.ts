"use server";
import { redirect } from "next/navigation";
import { get } from "@/lib/db";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const user = get<{ id: number; password_hash: string }>("SELECT id, password_hash FROM admin_users WHERE lower(email) = ?", [email]);
  if (!user || !verifyPassword(password, user.password_hash)) return { error: "Email hoặc mật khẩu không đúng." };
  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
