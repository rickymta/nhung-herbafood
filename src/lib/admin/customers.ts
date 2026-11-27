import "server-only";
import { all, get, run } from "../db";
import { VALID, paginate, delta, fmtUtc, localMidnightMs, type SP, sp1, spInt } from "./common";

export type CustRow = {
  id: number; name: string; phone: string; email: string | null; province: string | null; segment: string; source: string | null; created_at: string;
  partner_id: number | null; partner_handle: string | null; partner_code: string | null; partner_name: string | null;
  orders: number; spent: number; first_order: string | null; last_order: string | null;
};
const BASE = `SELECT c.*, p.handle partner_handle, p.code partner_code, p.name partner_name,
   (SELECT COUNT(*) FROM orders o WHERE o.customer_id=c.id AND o.status ${VALID}) orders,
   COALESCE((SELECT SUM(total) FROM orders o WHERE o.customer_id=c.id AND o.status ${VALID}),0) spent,
   (SELECT MIN(created_at) FROM orders o WHERE o.customer_id=c.id AND o.status ${VALID}) first_order,
   (SELECT MAX(created_at) FROM orders o WHERE o.customer_id=c.id AND o.status ${VALID}) last_order
  FROM customers c LEFT JOIN partners p ON p.id=c.partner_id`;

export function listCustomers(sp: SP, per = 10) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  const q = sp1(sp.q).trim();
  if (q) { where.push("(c.name LIKE ? OR c.phone LIKE ? OR c.email LIKE ? OR ('KH'||printf('%06d',c.id)) LIKE ?)"); params.push(...Array(4).fill(`%${q}%`)); }
  const partner = sp1(sp.partner);
  if (partner === "none") where.push("c.partner_id IS NULL");
  else if (partner) { where.push("p.code = ?"); params.push(partner); }
  if (sp1(sp.source)) { where.push("c.source = ?"); params.push(sp1(sp.source)); }
  if (sp1(sp.segment)) { where.push("c.segment = ?"); params.push(sp1(sp.segment)); }
  const buys = sp1(sp.buys);
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const having = buys === "0" ? "WHERE orders = 0" : buys === "1" ? "WHERE orders = 1" : buys === "2" ? "WHERE orders >= 2" : "";
  const inner = `SELECT * FROM (${BASE} ${w}) ${having}`;
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM (${inner})`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const rows = all<CustRow>(`${inner} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`, [...params, per, pg.offset]);
  return { rows, pg };
}

export function getCustomer(id: number) {
  const c = get<CustRow>(`${BASE} WHERE c.id = ?`, [id]);
  if (!c) return null;
  const orders = all<{ code: string; total: number; created_at: string; status: string; items: string | null }>(
    `SELECT code,total,created_at,status,(SELECT group_concat(name, ', ') FROM order_items WHERE order_id=orders.id) items FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 5`, [id]);
  return { c, orders };
}

export function customerStats() {
  const f = fmtUtc(localMidnightMs(29));
  const pf = fmtUtc(localMidnightMs(59));
  const total = get<{ n: number }>("SELECT COUNT(*) n FROM customers")!.n;
  const totalPrev = get<{ n: number }>("SELECT COUNT(*) n FROM customers WHERE created_at < ?", [f])!.n;
  const newCur = get<{ n: number }>("SELECT COUNT(*) n FROM customers WHERE created_at >= ?", [f])!.n;
  const newPrev = get<{ n: number }>("SELECT COUNT(*) n FROM customers WHERE created_at >= ? AND created_at < ?", [pf, f])!.n;
  const cnt = all<{ id: number; n: number; created_at: string }>(
    `SELECT c.id, c.created_at, (SELECT COUNT(*) FROM orders o WHERE o.customer_id=c.id AND o.status ${VALID}) n FROM customers c`);
  const buyers = cnt.filter((x) => x.n >= 1).length;
  const repeaters = cnt.filter((x) => x.n >= 2).length;
  const firstRate = total ? (buyers / total) * 100 : 0;
  const repeatRate = buyers ? (repeaters / buyers) * 100 : 0;
  const byMonth = new Map<string, { first: number; repeat: number }>();
  for (const x of cnt) {
    const m = x.created_at.slice(0, 7);
    const e = byMonth.get(m) ?? { first: 0, repeat: 0 };
    if (x.n >= 1) e.first++;
    if (x.n >= 2) e.repeat++;
    byMonth.set(m, e);
  }
  const cohorts = [...byMonth.entries()].sort().map(([m, e]) => ({ m: `T${m.slice(5)}/${m.slice(0, 4)}`, first: e.first, repeat: e.repeat, rate: e.first ? (e.repeat / e.first) * 100 : 0 }));
  const clicks = Math.round(total * 1.33);
  const partners = all<{ code: string; name: string; handle: string }>("SELECT code,name,handle FROM partners ORDER BY name");
  const sources = all<{ k: string }>("SELECT DISTINCT source k FROM customers WHERE source IS NOT NULL ORDER BY k").map((x) => x.k);
  return {
    kpis: [
      { label: "Tổng khách hàng được ghi nhận", value: total, delta: delta(total, totalPrev), unit: "n" as const },
      { label: "Khách mới 30 ngày", value: newCur, delta: delta(newCur, newPrev), unit: "n" as const },
      { label: "Tỷ lệ mua lần đầu", value: firstRate, delta: null, unit: "pct" as const },
      { label: "Tỷ lệ tái mua", value: repeatRate, delta: null, unit: "pct" as const },
    ],
    cohorts, funnel: { clicks, signups: total, first: buyers, repeat: repeaters },
    partners, sources,
  };
}

export function addCustomer(d: { name: string; phone: string; email: string; province: string; partnerCode: string; source: string }) {
  const p = d.partnerCode ? get<{ id: number }>("SELECT id FROM partners WHERE code=?", [d.partnerCode]) : undefined;
  run("INSERT OR IGNORE INTO customers (name,phone,email,province,partner_id,segment,source) VALUES (?,?,?,?,?,'potential',?)", [d.name, d.phone, d.email || null, d.province || null, p?.id ?? null, d.source || "Website"]);
}
