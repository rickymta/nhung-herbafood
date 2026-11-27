"use server";
import { requireAdmin } from "@/lib/auth";
import { addCustomer } from "@/lib/admin/customers";
import { logActivity } from "@/lib/admin/misc";
import { backOf, finish, str } from "@/lib/admin/action-utils";

export async function addCustomerAction(fd: FormData) {
  const u = await requireAdmin();
  const name = str(fd, "name");
  const phone = str(fd, "phone").replace(/\s|\./g, "");
  if (!name || phone.length < 9) finish("/admin/customers?modal=new", "Vui lòng nhập họ tên và số điện thoại hợp lệ");
  addCustomer({ name, phone, email: str(fd, "email"), province: str(fd, "province"), partnerCode: str(fd, "partner"), source: str(fd, "source") });
  logActivity(u.name, "customer.create", `Ghi nhận khách hàng ${name}`);
  finish(backOf(fd, "/admin/customers"), "Đã ghi nhận khách hàng");
}
