"use server";
import { requireAdmin } from "@/lib/auth";
import { deleteProduct, saveProduct } from "@/lib/admin/products";
import { logActivity } from "@/lib/admin/misc";
import { run, get } from "@/lib/db";
import { backOf, finish, flt, int, str } from "@/lib/admin/action-utils";

export async function saveProductAction(fd: FormData) {
  const u = await requireAdmin();
  const idRaw = str(fd, "id");
  const id = idRaw ? int(fd, "id") : null;
  const back = backOf(fd, "/admin/products");
  const name = str(fd, "name");
  const price = int(fd, "price");
  const sku = str(fd, "sku") || `SKU-${Date.now().toString(36).toUpperCase()}`;
  const retry = id ? `/admin/products?edit=${id}` : "/admin/products?edit=new";
  if (!name || price <= 0) finish(retry, "Tên sản phẩm và giá bán (> 0) là bắt buộc");
  const dup = get<{ id: number }>("SELECT id FROM products WHERE sku=? AND id != ?", [sku, id ?? -1]);
  if (dup) finish(retry, `SKU ${sku} đã tồn tại`);
  const orig = int(fd, "original_price");
  const pid = saveProduct(id, {
    name, sku, price, brand: str(fd, "brand"), category: str(fd, "category") || "supplement", original_price: orig > price ? orig : null,
    unit: str(fd, "unit") || "Hộp", pack_size: str(fd, "pack_size"), image: str(fd, "image"), stock: Math.max(0, int(fd, "stock")),
    commission_rate: Math.max(0, flt(fd, "commission_rate", 10)), status: str(fd, "status") === "hidden" ? "hidden" : "active",
    flash_sale: fd.get("flash_sale") ? 1 : 0, flash_limit: Math.max(0, int(fd, "flash_limit")), featured: fd.get("featured") ? 1 : 0,
    has_gift: fd.get("has_gift") ? 1 : 0, short_description: str(fd, "short_description"), description: str(fd, "description"),
  });
  logActivity(u.name, id ? "product.update" : "product.create", `${id ? "Cập nhật" : "Tạo"} sản phẩm ${name} (#${pid})`);
  finish(back, id ? `Đã cập nhật “${name}” – hiển thị ngay trên cửa hàng` : `Đã tạo sản phẩm “${name}”`, true);
}

export async function toggleProductAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  run("UPDATE products SET status = CASE WHEN status='active' THEN 'hidden' ELSE 'active' END WHERE id=?", [id]);
  logActivity(u.name, "product.toggle", `Bật/tắt sản phẩm #${id}`);
  finish(backOf(fd, "/admin/products"), "Đã đổi trạng thái sản phẩm", true);
}

export async function deleteProductAction(fd: FormData) {
  const u = await requireAdmin();
  const id = int(fd, "id");
  deleteProduct(id);
  logActivity(u.name, "product.delete", `Xóa sản phẩm #${id}`);
  finish("/admin/products", "Đã xóa sản phẩm", true);
}
