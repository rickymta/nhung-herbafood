"use server";
import { requireAdmin } from "@/lib/auth";
import { createCampaign, toggleCampaign } from "@/lib/admin/campaigns";
import { logActivity } from "@/lib/admin/misc";
import { backOf, finish, flt, int, str } from "@/lib/admin/action-utils";

export async function createCampaignAction(fd: FormData) {
  const u = await requireAdmin();
  const name = str(fd, "name");
  const start = str(fd, "start");
  const end = str(fd, "end");
  const utm = str(fd, "utm").toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!name || !start || !end || !utm || end < start) finish("/admin/campaigns?modal=new", "Vui lòng nhập đủ thông tin; ngày kết thúc phải sau ngày bắt đầu");
  createCampaign({ name, start, end, budget: int(fd, "budget"), utm, bonus: flt(fd, "bonus"), type: str(fd, "type") || "commission_boost", description: str(fd, "description") });
  logActivity(u.name, "campaign.create", `Tạo chiến dịch ${name}`);
  finish("/admin/campaigns", `Đã tạo chiến dịch “${name}”`);
}
export async function toggleCampaignAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  toggleCampaign(id);
  logActivity(u.name, "campaign.toggle", `Đổi trạng thái chiến dịch #${id}`);
  finish(backOf(fd, "/admin/campaigns"), "Đã đổi trạng thái chiến dịch");
}
