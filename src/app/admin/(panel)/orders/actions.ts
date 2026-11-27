"use server";
import { requireAdmin } from "@/lib/auth";
import { resyncOrder, setOrderStatus } from "@/lib/admin/orders";
import { addWebhook, logActivity, setSetting } from "@/lib/admin/misc";
import { get } from "@/lib/db";
import { backOf, finish, int, str } from "@/lib/admin/action-utils";
import { ORDER_STATUS } from "@/lib/admin/common";

export async function orderStatusAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  const status = str(fd, "status");
  const o = get<{ code: string }>("SELECT code FROM orders WHERE id=?", [id]);
  if (!o) finish(backOf(fd, "/admin/orders"), "Không tìm thấy đơn hàng");
  setOrderStatus(id, status);
  logActivity(u.name, "order.status", `Đơn ${o.code} → ${ORDER_STATUS[status] ?? status}`);
  finish(backOf(fd, "/admin/orders"), `Đã chuyển đơn ${o.code} sang “${ORDER_STATUS[status]}”`, true);
}

export async function resyncOrderAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  resyncOrder(id);
  logActivity(u.name, "integration.resync", `Đồng bộ lại đơn #${id}`);
  addWebhook("sync.retry", "success", `Đồng bộ lại đơn #${id} – thành công (mock)`);
  finish(backOf(fd, "/admin/orders"), "Đã đồng bộ lại đơn hàng");
}

export async function simulateWebhookAction(fd: FormData) {
  const u = await requireAdmin();
  const events = ["order.created", "order.completed", "order.refunded"];
  const ev = events[Math.floor(Math.random() * events.length)];
  addWebhook(ev, "success", `Webhook giả lập ${ev} từ TN MALL (mock) – HMAC hợp lệ`);
  setSetting("tnmall_last_sync", new Date().toISOString().slice(0, 19).replace("T", " "));
  logActivity(u.name, "integration.webhook", `Giả lập webhook ${ev}`);
  finish(backOf(fd, "/admin/orders"), `Đã nhận webhook ${ev} (mock)`);
}
