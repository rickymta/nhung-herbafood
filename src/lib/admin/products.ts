import "server-only";
import { all, get, run } from "../db";
import { VALID, paginate, type SP, sp1, spInt } from "./common";
import { slugify } from "../format";

export type ProdRow = {
  id: number; slug: string; sku: string; name: string; brand: string; category: string; price: number; original_price: number | null; unit: string;
  pack_size: string | null; image: string | null; stock: number; sold_count: number; flash_sale: number; flash_limit: number; flash_sold: number; featured: number;
  commission_rate: number; status: string; has_gift: number; short_description: string | null; description: string | null; has_orders: number; qty: number; gmv: number;
};
export const CATEGORY_LABEL: Record<string, string> = { supplement: "Thực phẩm bảo vệ", package: "Gói khám", device: "Thiết bị" };

export function listProducts(sp: SP, per = 12) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (sp1(sp.category)) { where.push("p.category=?"); params.push(sp1(sp.category)); }
  if (sp1(sp.status)) { where.push("p.status=?"); params.push(sp1(sp.status)); }
  if (sp1(sp.q)) { where.push("(p.name LIKE ? OR p.sku LIKE ?)"); params.push(`%${sp1(sp.q)}%`, `%${sp1(sp.q)}%`); }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM products p ${w}`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const rows = all<ProdRow>(
    `SELECT p.*, 0 has_orders,
       COALESCE((SELECT SUM(i.quantity) FROM order_items i JOIN orders o ON o.id=i.order_id WHERE i.product_id=p.id AND o.status ${VALID}),0) qty,
       COALESCE((SELECT SUM(i.quantity*i.price) FROM order_items i JOIN orders o ON o.id=i.order_id WHERE i.product_id=p.id AND o.status ${VALID}),0) gmv
     FROM products p ${w} ORDER BY p.sort, p.id LIMIT ? OFFSET ?`,
    [...params, per, pg.offset],
  );
  return { rows, pg };
}
export function productKpis() {
  const c = (cond: string) => get<{ n: number }>(`SELECT COUNT(*) n FROM products WHERE ${cond}`)!.n;
  const camp = get<{ n: number }>("SELECT COUNT(*) n FROM campaigns WHERE status='active' AND start_date <= date('now','+7 hours') AND end_date >= date('now','+7 hours')")!.n;
  const avg = get<{ a: number }>("SELECT COALESCE(AVG(commission_rate),0) a FROM products")!.a;
  return { total: c("1=1"), active: c("status='active'"), flash: c("flash_sale=1"), lowStock: c("stock < 20"), camp, avg };
}
export function getProduct(id: number) {
  return get<ProdRow>("SELECT p.*, 0 has_orders, 0 qty, 0 gmv FROM products p WHERE id=?", [id]);
}

export type ProductInput = {
  name: string; sku: string; brand: string; category: string; price: number; original_price: number | null; unit: string; pack_size: string; image: string;
  stock: number; commission_rate: number; status: string; flash_sale: number; flash_limit: number; featured: number; has_gift: number; short_description: string; description: string;
};
export function saveProduct(id: number | null, d: ProductInput) {
  if (id) {
    run(
      `UPDATE products SET name=?, sku=?, brand=?, category=?, price=?, original_price=?, unit=?, pack_size=?, image=?, stock=?, commission_rate=?, status=?, flash_sale=?, flash_limit=?, featured=?, has_gift=?, short_description=?, description=? WHERE id=?`,
      [d.name, d.sku, d.brand, d.category, d.price, d.original_price, d.unit, d.pack_size || null, d.image || null, d.stock, d.commission_rate, d.status, d.flash_sale, d.flash_limit, d.featured, d.has_gift, d.short_description || null, d.description || null, id],
    );
    return id;
  }
  let slug = slugify(d.name) || "san-pham";
  while (get("SELECT 1 FROM products WHERE slug=?", [slug])) slug += `-${Math.floor(Math.random() * 900 + 100)}`;
  const r = run(
    `INSERT INTO products (slug,sku,name,brand,category,price,original_price,unit,pack_size,image,stock,commission_rate,status,flash_sale,flash_limit,featured,has_gift,short_description,description,sort)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, (SELECT COALESCE(MAX(sort),0)+1 FROM products))`,
    [slug, d.sku, d.name, d.brand, d.category, d.price, d.original_price, d.unit, d.pack_size || null, d.image || null, d.stock, d.commission_rate, d.status, d.flash_sale, d.flash_limit, d.featured, d.has_gift, d.short_description || null, d.description || null],
  );
  return Number(r.lastInsertRowid);
}
export function deleteProduct(id: number) {
  run("DELETE FROM products WHERE id=?", [id]);
}
