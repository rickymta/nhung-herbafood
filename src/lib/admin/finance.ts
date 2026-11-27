import "server-only";
import { all, get, run, tx } from "../db";
import { paginate, delta, fmtUtc, localMidnightMs, TZ_OFFSET_H, type SP, sp1, spInt } from "./common";

const monthLabel = (utc: string) => {
  const d = new Date(Date.parse(utc.replace(" ", "T") + "Z") + TZ_OFFSET_H * 3600e3);
  return `T${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
};
export const currentPeriod = () => monthLabel(fmtUtc(Date.now()));

export function commissionKpis() {
  const f = fmtUtc(localMidnightMs(29));
  const pf = fmtUtc(localMidnightMs(59));
  const s = (cond: string, from?: string, to?: string) =>
    get<{ s: number }>(`SELECT COALESCE(SUM(amount+adjustment),0) s FROM commissions WHERE ${cond} ${from ? "AND created_at >= ?" : ""} ${to ? "AND created_at < ?" : ""}`, [from, to].filter(Boolean) as string[])!.s;
  const mk = (label: string, cond: string) => ({ label, value: s(cond), delta: delta(s(cond, f), s(cond, pf, f)) });
  return [
    mk("Tổng hoa hồng phát sinh", "status != 'rejected'"),
    mk("Chờ duyệt", "status = 'pending'"),
    mk("Sắp thanh toán", "status IN ('approved','held') AND payout_id IS NULL"),
    mk("Đã thanh toán", "status = 'paid'"),
  ];
}

export type CommRow = {
  id: number; created_at: string; partner_code: string; partner_name: string; partner_handle: string | null; order_code: string; base_amount: number;
  rate: number; amount: number; adjustment: number; status: string; approved_by: string | null; payout_id: number | null;
};
export function listCommissions(sp: SP, per = 8) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  if (sp1(sp.status)) { where.push("c.status = ?"); params.push(sp1(sp.status)); }
  if (sp1(sp.campaign)) { where.push("o.campaign_id = ?"); params.push(Number(sp1(sp.campaign))); }
  if (sp1(sp.q)) { where.push("(p.name LIKE ? OR p.code LIKE ? OR o.code LIKE ?)"); params.push(...Array(3).fill(`%${sp1(sp.q)}%`)); }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const from = `FROM commissions c JOIN orders o ON o.id=c.order_id JOIN partners p ON p.id=c.partner_id ${w}`;
  const total = get<{ n: number }>(`SELECT COUNT(*) n ${from}`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const rows = all<CommRow>(
    `SELECT c.id, c.created_at, p.code partner_code, p.name partner_name, p.handle partner_handle, o.code order_code, c.base_amount, c.rate, c.amount, c.adjustment, c.status, c.approved_by, c.payout_id
       ${from} ORDER BY c.created_at DESC, c.id DESC LIMIT ? OFFSET ?`,
    [...params, per, pg.offset],
  );
  return { rows, pg, monthLabel };
}

export function setCommissionStatus(id: number, status: "approved" | "rejected" | "held" | "pending", by: string) {
  run("UPDATE commissions SET status=?, approved_by=? WHERE id=? AND status != 'paid'", [status, status === "pending" ? null : by, id]);
}
export function approveAllPending(by: string) {
  run(
    `UPDATE commissions SET status='approved', approved_by=? WHERE status='pending' AND order_id IN (SELECT id FROM orders WHERE status='completed')`,
    [by],
  );
}
export function adjustCommission(id: number, amount: number) {
  run("UPDATE commissions SET adjustment=? WHERE id=? AND status != 'paid'", [amount, id]);
}

export function reconcile() {
  const p = fmtUtc(localMidnightMs(new Date(Date.now() + TZ_OFFSET_H * 3600e3).getUTCDate() - 1));
  const sum = (cond: string) => get<{ s: number }>(`SELECT COALESCE(SUM(amount+adjustment),0) s FROM commissions WHERE ${cond} AND created_at >= ?`, [p])!.s;
  const accrual = sum("1=1");
  const reversal = sum("status='rejected'");
  const paid = sum("status='paid'");
  const diff = get<{ n: number; s: number }>(`SELECT COUNT(*) n, COALESCE(SUM(total),0) s FROM orders WHERE sync_status='error' AND created_at >= ?`, [p])!;
  const notEligible = get<{ n: number }>(`SELECT COUNT(*) n FROM orders o WHERE o.partner_id IS NOT NULL AND o.status IN ('confirmed','shipping') AND o.created_at >= ?`, [p])!.n;
  const adj = get<{ n: number; s: number }>(`SELECT COUNT(*) n, COALESCE(SUM(adjustment),0) s FROM commissions WHERE adjustment != 0`)!;
  const entries = get<{ n: number }>("SELECT COUNT(*) n FROM commissions")!.n;
  return { accrual, reversal, paid, diff, notEligible, adj, entries, period: currentPeriod() };
}

/* ---------------- payouts ---------------- */
export function minPayout() {
  return Number(get<{ value: string }>("SELECT value FROM settings WHERE key='min_payout'")?.value ?? 500000);
}
export function taxFor(sum: number) {
  const rate = Number(get<{ value: string }>("SELECT value FROM settings WHERE key='tax_rate'")?.value ?? 10);
  const th = Number(get<{ value: string }>("SELECT value FROM settings WHERE key='tax_threshold'")?.value ?? 2000000);
  return sum >= th ? Math.floor((sum * rate) / 100) : 0;
}

export function payoutPreview() {
  const min = minPayout();
  const rows = all<{ partner_id: number; code: string; name: string; sum: number; n: number }>(
    `SELECT p.id partner_id, p.code, p.name, SUM(c.amount+c.adjustment) sum, COUNT(*) n
       FROM commissions c JOIN partners p ON p.id=c.partner_id
      WHERE c.status='approved' AND c.payout_id IS NULL GROUP BY p.id HAVING sum >= ? ORDER BY sum DESC`, [min]);
  const total = rows.reduce((s, r) => s + r.sum, 0);
  const tax = rows.reduce((s, r) => s + taxFor(r.sum), 0);
  return { rows, total, tax, count: rows.length, min };
}

export function listBatches() {
  return all<{ batch: string; period: string; partners: number; total: number; tax: number; status: string; created_by: string | null; approved_by: string | null; created_at: string; paid_at: string | null }>(
    `SELECT batch, MIN(period) period, COUNT(*) partners, SUM(amount) total, SUM(tax) tax,
            CASE WHEN SUM(status!='paid')=0 THEN 'paid' ELSE 'pending' END status,
            MIN(created_by) created_by, MIN(approved_by) approved_by, MIN(created_at) created_at, MAX(paid_at) paid_at
       FROM payouts WHERE batch IS NOT NULL GROUP BY batch ORDER BY MIN(created_at) DESC, batch DESC`);
}
export function batchDetail(batch: string) {
  return all<{ id: number; code: string; partner_code: string; partner_name: string; bank_name: string | null; bank_account: string | null; amount: number; tax: number; status: string; paid_at: string | null }>(
    `SELECT po.id, po.code, p.code partner_code, p.name partner_name, p.bank_name, p.bank_account, po.amount, po.tax, po.status, po.paid_at
       FROM payouts po JOIN partners p ON p.id=po.partner_id WHERE po.batch=? ORDER BY po.amount DESC`, [batch]);
}

export function createBatch(by: string) {
  const prev = payoutPreview();
  if (!prev.count) return null;
  return tx(() => {
    const d = new Date(Date.now() + TZ_OFFSET_H * 3600e3);
    const ymd = d.toISOString().slice(0, 10).replace(/-/g, "");
    const n = get<{ n: number }>("SELECT COUNT(DISTINCT batch) n FROM payouts WHERE batch LIKE ?", [`PAY-${ymd}-%`])!.n + 1;
    const batch = `PAY-${ymd}-${String(n).padStart(3, "0")}`;
    const period = currentPeriod();
    let i = get<{ n: number }>("SELECT COUNT(*) n FROM payouts")!.n;
    for (const r of prev.rows) {
      const res = run(
        "INSERT INTO payouts (code,partner_id,period,amount,tax,method,status,batch,created_by) VALUES (?,?,?,?,?,'bank_transfer','pending',?,?)",
        [`PO${String(++i + 100).padStart(4, "0")}`, r.partner_id, period, r.sum, taxFor(r.sum), batch, by],
      );
      run("UPDATE commissions SET payout_id=? WHERE partner_id=? AND status='approved' AND payout_id IS NULL", [Number(res.lastInsertRowid), r.partner_id]);
    }
    return batch;
  });
}
export function markBatchPaid(batch: string, by: string) {
  tx(() => {
    run("UPDATE payouts SET status='paid', paid_at=datetime('now'), approved_by=? WHERE batch=? AND status!='paid'", [by, batch]);
    run("UPDATE commissions SET status='paid' WHERE payout_id IN (SELECT id FROM payouts WHERE batch=?) AND status IN ('approved','held')", [batch]);
  });
}
export function cancelBatch(batch: string) {
  tx(() => {
    run("UPDATE commissions SET payout_id=NULL WHERE payout_id IN (SELECT id FROM payouts WHERE batch=? AND status!='paid')", [batch]);
    run("DELETE FROM payouts WHERE batch=? AND status!='paid'", [batch]);
  });
}

export function nextPayoutDate(): string {
  const day = Number(get<{ value: string }>("SELECT value FROM settings WHERE key='payout_day'")?.value ?? 15);
  const now = new Date(Date.now() + TZ_OFFSET_H * 3600e3);
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), day, 0, 0, 0));
  if (d.getTime() < now.getTime() - 86400e3) d.setUTCMonth(d.getUTCMonth() + 1);
  return d.toISOString();
}
