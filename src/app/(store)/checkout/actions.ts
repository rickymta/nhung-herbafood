"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { get, run, tx, parseJson } from "@/lib/db";
import { getSettings } from "@/lib/store/queries";
import type { Variant } from "@/lib/store/types";

export type CheckoutState = { error?: string; fields?: Record<string, string> };

type DbProduct = {
  id: number; name: string; image: string | null; price: number; variants: string; stock: number; status: string;
  flash_sale: number;
};

function orderCode(): string {
  for (let i = 0; i < 20; i++) {
    const code = `TNSG-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!get("SELECT 1 FROM orders WHERE code = ?", [code])) return code;
  }
  return `TNSG-${Date.now().toString().slice(-8)}`;
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const str = (k: string) => String(formData.get(k) ?? "").trim();
  const fields = { name: str("name"), phone: str("phone"), email: str("email"), address: str("address"), province: str("province"), note: str("note"), payment: str("payment") };

  if (fields.name.length < 2) return { error: "Vui lòng nhập họ và tên.", fields };
  const phone = fields.phone.replace(/[\s.-]/g, "");
  if (!/^(0|\+84)\d{9}$/.test(phone)) return { error: "Số điện thoại không hợp lệ (ví dụ 0901234567).", fields };
  if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) return { error: "Email không hợp lệ.", fields };
  if (fields.address.length < 5) return { error: "Vui lòng nhập địa chỉ nhận hàng.", fields };
  if (!fields.province) return { error: "Vui lòng chọn Tỉnh/Thành phố.", fields };
  const payment = fields.payment === "bank" ? "bank_transfer" : "cod";

  let cartItems: { productId: number; variant: string; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(str("items"));
  } catch {}
  if (!Array.isArray(cartItems) || cartItems.length === 0) return { error: "Giỏ hàng đang trống.", fields };

  const settings = getSettings();
  const threshold = Number(settings.free_ship_threshold || 500000);
  const shipFee = Number(settings.shipping_fee || 30000);
  const ref = (await cookies()).get("tn_ref")?.value?.toUpperCase();

  let code = "";
  try {
    code = tx(() => {
      const lines: { p: DbProduct; variant: string; price: number; qty: number }[] = [];
      for (const it of cartItems) {
        const qty = Math.max(1, Math.min(99, Math.floor(Number(it.quantity) || 1)));
        const p = get<DbProduct>("SELECT id, name, image, price, variants, stock, status, flash_sale FROM products WHERE id = ?", [Number(it.productId)]);
        if (!p || p.status !== "active") throw new Error("Có sản phẩm không còn kinh doanh, vui lòng kiểm tra lại giỏ hàng.");
        if (p.stock < qty) throw new Error(`"${p.name.slice(0, 50)}" chỉ còn ${p.stock} sản phẩm trong kho.`);
        const variants = parseJson<Variant[]>(p.variants, []);
        const v = variants.find((x) => x.label === it.variant);
        lines.push({ p, variant: v?.label ?? it.variant ?? "", price: v?.price ?? p.price, qty });
      }
      const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
      const shipping = subtotal >= threshold ? 0 : shipFee;
      const total = subtotal + shipping;

      // customer upsert by phone
      let customer = get<{ id: number }>("SELECT id FROM customers WHERE phone = ?", [phone]);
      const partner = ref ? get<{ id: number; commission_rate: number }>("SELECT id, commission_rate FROM partners WHERE UPPER(code) = ? AND status = 'active'", [ref]) : undefined;
      if (customer) {
        run("UPDATE customers SET name = ?, email = COALESCE(NULLIF(?, ''), email), address = ?, province = ? WHERE id = ?", [fields.name, fields.email, fields.address, fields.province, customer.id]);
      } else {
        const r = run("INSERT INTO customers (name, phone, email, address, province, partner_id, segment) VALUES (?,?,?,?,?,?, 'new')", [fields.name, phone, fields.email || null, fields.address, fields.province, partner?.id ?? null]);
        customer = { id: Number(r.lastInsertRowid) };
      }

      const campaign = partner
        ? get<{ id: number; bonus_rate: number }>(
            "SELECT id, bonus_rate FROM campaigns WHERE status = 'active' AND date('now','localtime') BETWEEN start_date AND end_date ORDER BY bonus_rate DESC LIMIT 1",
          )
        : undefined;

      const c = orderCode();
      const o = run(
        `INSERT INTO orders (code, customer_id, customer_name, customer_phone, customer_email, shipping_address, province, partner_id, campaign_id,
           source, subtotal, discount, shipping_fee, total, payment_method, payment_status, status, note)
         VALUES (?,?,?,?,?,?,?,?,?, 'website', ?, 0, ?, ?, ?, 'unpaid', 'pending', ?)`,
        [c, customer.id, fields.name, phone, fields.email || null, fields.address, fields.province, partner?.id ?? null, campaign?.id ?? null, subtotal, shipping, total, payment, fields.note || null],
      );
      const orderId = Number(o.lastInsertRowid);
      for (const l of lines) {
        run("INSERT INTO order_items (order_id, product_id, name, variant, image, price, quantity) VALUES (?,?,?,?,?,?,?)", [orderId, l.p.id, l.p.name, l.variant, l.p.image, l.price, l.qty]);
        run("UPDATE products SET stock = stock - ?, sold_count = sold_count + ?, flash_sold = CASE WHEN flash_sale = 1 THEN flash_sold + ? ELSE flash_sold END WHERE id = ?", [l.qty, l.qty, l.qty, l.p.id]);
      }
      if (partner) {
        const rate = partner.commission_rate + (campaign?.bonus_rate ?? 0);
        run("INSERT INTO commissions (order_id, partner_id, base_amount, rate, amount, status) VALUES (?,?,?,?,?, 'pending')", [orderId, partner.id, subtotal, rate, Math.round((subtotal * rate) / 100)]);
      }
      return c;
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Không thể tạo đơn hàng, vui lòng thử lại.", fields };
  }

  revalidatePath("/products");
  revalidatePath("/admin", "layout");
  redirect(`/orders/success?code=${code}`);
}
