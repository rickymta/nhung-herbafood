"use server";
import { requireAdmin } from "@/lib/auth";
import { createPartner, setPartnerStatus, updatePartner, bulkApprove } from "@/lib/admin/partners";
import { logActivity } from "@/lib/admin/misc";
import { backOf, finish, flt, str } from "@/lib/admin/action-utils";
import { TYPE_LABEL } from "@/lib/admin/common";

export async function createPartnerAction(fd: FormData) {
  const u = await requireAdmin();
  const name = str(fd, "name");
  const email = str(fd, "email");
  const back = backOf(fd, "/admin/partners");
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) finish(back + (back.includes("?") ? "&" : "?") + "modal=new", "Vui lòng nhập họ tên và email hợp lệ");
  const type = ["affiliate", "ctv", "agency"].includes(str(fd, "type")) ? str(fd, "type") : "affiliate";
  const code = createPartner({ name, email, type, source: str(fd, "source") || "Website", region: str(fd, "region") || "Miền Bắc", province: str(fd, "province") || "Hà Nội" });
  logActivity(u.name, "partner.create", `Tạo đối tác ${code} – ${name} (${TYPE_LABEL[type]})`);
  finish("/admin/partners", `Đã tạo đối tác ${code} (Chờ duyệt)`);
}

export async function updatePartnerAction(fd: FormData) {
  const u = await requireAdmin();
  const code = str(fd, "code");
  const back = backOf(fd, "/admin/partners");
  updatePartner(code, {
    name: str(fd, "name"), email: str(fd, "email"), phone: str(fd, "phone"), tier: str(fd, "tier") || "bronze", rate: flt(fd, "rate", 10),
    type: str(fd, "type") || "affiliate", source: str(fd, "source"), region: str(fd, "region"), province: str(fd, "province"),
  });
  logActivity(u.name, "partner.update", `Cập nhật hồ sơ ${code}`);
  finish(back, `Đã cập nhật ${code}`);
}

export async function partnerStatusAction(fd: FormData) {
  const u = await requireAdmin();
  const code = str(fd, "code");
  const status = str(fd, "status") as "active" | "suspended" | "pending";
  if (!["active", "suspended", "pending"].includes(status)) return;
  setPartnerStatus(code, status);
  logActivity(u.name, status === "active" ? "application.approve" : "partner.suspend", `${status === "active" ? "Kích hoạt" : "Tạm dừng"} đối tác ${code}`);
  finish(backOf(fd, "/admin/partners"), status === "active" ? `Đã kích hoạt ${code}` : `Đã tạm dừng ${code}`);
}

export async function bulkApproveAction(fd: FormData) {
  const u = await requireAdmin();
  bulkApprove();
  logActivity(u.name, "application.approve", "Duyệt tất cả hồ sơ đối tác chờ xử lý");
  finish(backOf(fd, "/admin/partners"), "Đã duyệt tất cả hồ sơ chờ xử lý");
}

export async function notifyPartnerAction(fd: FormData) {
  const u = await requireAdmin();
  const code = str(fd, "code");
  logActivity(u.name, "partner.notify", `Gửi thông báo tới đối tác ${code}`);
  finish(backOf(fd, `/admin/partners/${code}`), `Đã gửi thông báo tới ${code}`);
}
