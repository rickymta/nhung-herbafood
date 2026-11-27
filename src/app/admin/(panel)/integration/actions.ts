"use server";
import { requireAdmin } from "@/lib/auth";
import { addWebhook, logActivity, setSetting } from "@/lib/admin/misc";
import { backOf, finish, str } from "@/lib/admin/action-utils";

export async function saveIntegrationAction(fd: FormData) {
  const u = await requireAdmin();
  setSetting("tnmall_mode", str(fd, "mode") === "live" ? "live" : "mock");
  setSetting("tnmall_base_url", str(fd, "base_url"));
  if (str(fd, "api_key") && !str(fd, "api_key").includes("•")) setSetting("tnmall_api_key", str(fd, "api_key"));
  if (str(fd, "secret") && !str(fd, "secret").includes("•")) setSetting("tnmall_webhook_secret", str(fd, "secret"));
  setSetting("tnmall_auto_sync", fd.get("auto_sync") ? "1" : "0");
  logActivity(u.name, "integration.manage", "Cập nhật cấu hình tích hợp TN MALL");
  finish(backOf(fd, "/admin/integration"), "Đã lưu cấu hình tích hợp");
}

export async function syncNowAction(fd: FormData) {
  const u = await requireAdmin();
  addWebhook("sync.pull", "success", "Đồng bộ bù theo since= (mock) – hoàn tất");
  setSetting("tnmall_last_sync", new Date().toISOString().slice(0, 19).replace("T", " "));
  logActivity(u.name, "integration.sync", "Đồng bộ thủ công TN MALL (mock)");
  finish(backOf(fd, "/admin/integration"), "Đã đồng bộ (mock)");
}
