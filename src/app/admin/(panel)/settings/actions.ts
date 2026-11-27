"use server";
import { requireAdmin, hashPassword, verifyPassword } from "@/lib/auth";
import { get, run } from "@/lib/db";
import { logActivity, setSetting } from "@/lib/admin/misc";
import { backOf, finish, flt, int, str } from "@/lib/admin/action-utils";

export async function savePolicyAction(fd: FormData) {
  const u = await requireAdmin();
  setSetting("policy_version", str(fd, "policy_version") || "v1.3");
  setSetting("cookie_days", String(Math.min(365, Math.max(1, int(fd, "cookie_days", 30)))));
  setSetting("return_window_days", String(Math.max(0, int(fd, "return_window_days", 7))));
  setSetting("min_payout", String(Math.max(0, int(fd, "min_payout", 500000))));
  setSetting("tax_rate", String(Math.max(0, flt(fd, "tax_rate", 10))));
  setSetting("tax_threshold", String(Math.max(0, int(fd, "tax_threshold", 2000000))));
  setSetting("default_commission_rate", String(Math.max(0, flt(fd, "default_commission_rate", 10))));
  setSetting("payout_day", String(Math.min(28, Math.max(1, int(fd, "payout_day", 15)))));
  logActivity(u.name, "policy.publish", `Cập nhật chính sách chương trình ${str(fd, "policy_version")}`);
  finish(backOf(fd, "/admin/settings"), "Đã lưu chính sách chương trình");
}

export async function saveTiersAction(fd: FormData) {
  const u = await requireAdmin();
  const tiers = ["bronze", "silver", "gold", "sapphire"].map((k) => ({
    key: k, name: k.charAt(0).toUpperCase() + k.slice(1), min_gmv: Math.max(0, int(fd, `${k}_min`)), rate: Math.max(0, flt(fd, `${k}_rate`)),
  }));
  setSetting("tiers", JSON.stringify(tiers));
  if (fd.get("apply")) for (const t of tiers) run("UPDATE partners SET commission_rate=? WHERE tier=?", [t.rate, t.key]);
  logActivity(u.name, "policy.draft", `Cập nhật cấp bậc đối tác${fd.get("apply") ? " và áp dụng tỷ lệ cho đối tác" : ""}`);
  finish(backOf(fd, "/admin/settings?tab=tiers"), "Đã lưu cấp bậc & tỷ lệ hoa hồng");
}

export async function changePasswordAction(fd: FormData) {
  const u = await requireAdmin();
  const cur = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const again = String(fd.get("again") ?? "");
  const back = "/admin/settings?tab=security";
  const row = get<{ password_hash: string }>("SELECT password_hash FROM admin_users WHERE id=?", [u.id]);
  if (!row || !verifyPassword(cur, row.password_hash)) finish(back, "Mật khẩu hiện tại không đúng");
  if (next.length < 8) finish(back, "Mật khẩu mới phải có ít nhất 8 ký tự");
  if (next !== again) finish(back, "Mật khẩu nhập lại không khớp");
  run("UPDATE admin_users SET password_hash=? WHERE id=?", [hashPassword(next), u.id]);
  logActivity(u.name, "auth.password", "Đổi mật khẩu quản trị");
  finish(back, "Đã đổi mật khẩu");
}
