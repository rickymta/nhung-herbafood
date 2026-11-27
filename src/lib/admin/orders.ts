import "server-only";
import { all, get, run, tx } from "../db";
import { VALID, paginate, delta, fmtUtc, localMidnightMs, type SP, sp1, spInt } from "./common";
import { dailySeries } from "./dashboard";

export type OrderRow = {
  id: number; code: string; customer_name: string; customer_phone: string; partner_id: number | null; partner_code: string | null; partner_name: string | null;
  total: number; status: string; payment_status: string; payment_method: string; sync_status: string; created_at: string; items: string | null; comm_status: string | null; comm_amount: number | null;
};

export function listOrders(sp: SP, per = 10) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  const q = sp1(sp.q).trim();
  if (q) {
    where.push("(o.code LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ? OR p.code LIKE ?)");
    params.push(...Array(4).fill(`%${q}%`));
  }
  const st = sp1(sp.status);
  if (st) { where.push("o.status = ?"); params.push(st); }
  const pay = sp1(sp.payment);
  if (pay) { where.push("o.payment_status = ?"); params.push(pay); }
  const sync = sp1(sp.sync);
  if (sync) { where.push("o.sync_status = ?"); params.push(sync); }
  const partner = sp1(sp.partner);
  if (partner === "none") where.push("o.partner_id IS NULL");
  else if (partner) { where.push("p.code = ?"); params.push(partner); }
  if (sp1(sp.tab) === "errors") where.push("o.sync_status = 'error'");
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM orders o LEFT JOIN partners p ON p.id=o.partner_id ${w}`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const rows = all<OrderRow>(
    `SELECT o.id,o.code,o.customer_name,o.customer_phone,o.partner_id,p.code partner_code,p.name partner_name,o.total,o.status,o.payment_status,o.payment_method,o.sync_status,o.created_at,
            (SELECT group_concat(name, ', ') FROM order_items WHERE order_id=o.id) items,
            (SELECT status FROM commissions WHERE order_id=o.id LIMIT 1) comm_status,
            (SELECT amount FROM commissions WHERE order_id=o.id LIMIT 1) comm_amount
       FROM orders o LEFT JOIN partners p ON p.id=o.partner_id ${w} ORDER BY o.created_at DESC, o.id DESC LIMIT ? OFFSET ?`,
    [...params, per, pg.offset],
  );
  return { rows, pg };
}

export function orderKpis() {
  const f = fmtUtc(localMidnightMs(29));
  const pf = fmtUtc(localMidnightMs(59));
  const c = (cond: string, from: string, to?: string) =>
    get<{ n: number }>(`SELECT COUNT(*) n FROM orders WHERE ${cond} AND created_at >= ? ${to ? "AND created_at < ?" : ""}`, to ? [from, to] : [from])!.n;
  const mk = (label: string, cond: string) => ({ label, value: get<{ n: number }>(`SELECT COUNT(*) n FROM orders WHERE ${cond}`)!.n, delta: delta(c(cond, f), c(cond, pf, f)) });
  const lastSync = get<{ value: string }>("SELECT value FROM settings WHERE key='tnmall_last_sync'")?.value ?? null;
  const errs = get<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE sync_status='error'")!.n;
  const total = get<{ n: number }>("SELECT COUNT(*) n FROM orders")!.n;
  return {
    kpis: [
      mk("Tổng đơn hợp lệ", `status ${VALID}`), mk("Đơn chờ xác nhận", "status='pending'"),
      mk("Đơn đã hoàn thành", "status='completed'"), mk("Lỗi đồng bộ", "sync_status='error'"),
    ],
    lastSync, errs, total,
    syncRate: total ? ((total - errs) / total) * 100 : 100,
    daily: dailySeries(f, 30),
  };
}

export function getOrder(code: string) {
  const o = get<Record<string, string | number | null>>(
    `SELECT o.*, p.code partner_code, p.name partner_name, p.handle partner_handle FROM orders o LEFT JOIN partners p ON p.id=o.partner_id WHERE o.code=?`, [code]);
  if (!o) return null;
  const items = all<{ name: string; variant: string | null; image: string | null; price: number; quantity: number }>(
    "SELECT name,variant,image,price,quantity FROM order_items WHERE order_id=?", [o.id as number]);
  const comm = get<{ id: number; amount: number; rate: number; status: string }>("SELECT id,amount,rate,status FROM commissions WHERE order_id=?", [o.id as number]);
  const camp = o.campaign_id ? get<{ name: string }>("SELECT name FROM campaigns WHERE id=?", [o.campaign_id as number]) : undefined;
  return { o, items, comm, camp };
}

/** Change order status and keep commissions consistent (ARCHITECTURE.md flow 3). */
export function setOrderStatus(id: number, status: string) {
  if (!["pending", "confirmed", "shipping", "completed", "cancelled", "returned"].includes(status)) throw new Error("Trạng thái không hợp lệ");
  tx(() => {
    const pay = status === "completed" ? "paid" : status === "returned" ? "refunded" : null;
    run(`UPDATE orders SET status=?, payment_status=COALESCE(?, payment_status), updated_at=datetime('now') WHERE id=?`, [status, pay, id]);
    if (status === "completed") run("UPDATE commissions SET status='approved' WHERE order_id=? AND status IN ('pending','rejected')", [id]);
    else if (status === "cancelled" || status === "returned") run("UPDATE commissions SET status='rejected' WHERE order_id=? AND status IN ('pending','approved','held')", [id]);
    else run("UPDATE commissions SET status='pending' WHERE order_id=? AND status IN ('rejected','approved','held') AND payout_id IS NULL", [id]);
  });
}

export function resyncOrder(id: number) {
  run("UPDATE orders SET sync_status='synced' WHERE id=?", [id]);
}
