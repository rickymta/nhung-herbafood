"use server";
import { requireAdmin } from "@/lib/auth";
import { adjustCommission, approveAllPending, cancelBatch, createBatch, markBatchPaid, setCommissionStatus } from "@/lib/admin/finance";
import { logActivity } from "@/lib/admin/misc";
import { backOf, finish, int, str } from "@/lib/admin/action-utils";
import { vndAdmin } from "@/lib/format";

export async function commissionStatusAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  const status = str(fd, "status") as "approved" | "rejected" | "held" | "pending";
  if (!["approved", "rejected", "held", "pending"].includes(status)) return;
  setCommissionStatus(id, status, u.name);
  logActivity(u.name, "commission." + status, `Hoa hồng #${id} → ${status}`);
  finish(backOf(fd, "/admin/commission"), status === "approved" ? "Đã duyệt hoa hồng" : status === "rejected" ? "Đã từ chối hoa hồng" : status === "held" ? "Đã tạm giữ hoa hồng" : "Đã đặt lại chờ duyệt");
}

export async function approveAllAction(fd: FormData) {
  const u = await requireAdmin();
  approveAllPending(u.name);
  logActivity(u.name, "commission.approve_all", "Duyệt tất cả hoa hồng của đơn đã hoàn thành");
  finish(backOf(fd, "/admin/commission"), "Đã duyệt hoa hồng của các đơn hoàn thành");
}

export async function adjustAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  const amt = int(fd, "amount");
  adjustCommission(id, amt);
  logActivity(u.name, "commission.adjust", `Điều chỉnh hoa hồng #${id}: ${vndAdmin(amt)}`);
  finish(backOf(fd, "/admin/commission"), "Đã lưu điều chỉnh (bút toán ADJUSTMENT)");
}

export async function createBatchAction(fd: FormData) {
  const u = await requireAdmin();
  const batch = createBatch(u.name);
  if (!batch) finish(backOf(fd, "/admin/payments"), "Không có hoa hồng đã duyệt đủ điều kiện để lập đợt chi");
  logActivity(u.name, "payout.create", `Lập đợt chi ${batch}`);
  finish(backOf(fd, "/admin/payments"), `Đã tạo đợt chi ${batch}`);
}

export async function payBatchAction(fd: FormData) {
  const u = await requireAdmin();
  const batch = str(fd, "batch");
  markBatchPaid(batch, u.name);
  logActivity(u.name, "payout.approve", `Duyệt & đánh dấu đã chi ${batch}`);
  finish(backOf(fd, "/admin/payments"), `Đã đánh dấu ${batch} là đã thanh toán – hoa hồng chuyển “Đã thanh toán”`);
}

export async function cancelBatchAction(fd: FormData) {
  const u = await requireAdmin();
  const batch = str(fd, "batch");
  cancelBatch(batch);
  logActivity(u.name, "payout.reject", `Từ chối / hủy đợt chi ${batch}`);
  finish(backOf(fd, "/admin/payments"), `Đã hủy đợt chi ${batch}, hoa hồng trở lại trạng thái đã duyệt`);
}
