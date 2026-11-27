import "server-only";
import { all, get, run, tx } from "../db";
import { VALID, paginate, delta, fmtUtc, localMidnightMs, type SP, sp1, spInt } from "./common";
import { dailySeries } from "./dashboard";

export type PartnerRow = {
  id: number; code: string; name: string; handle: string | null; email: string | null; phone: string | null; channel: string | null;
  tier: string; status: string; commission_rate: number; region: string | null; type: string; owner: string | null; province: string | null;
  joined_at: string; bank_name: string | null; bank_account: string | null; gmv: number; orders: number; commission: number;
};

const SORTS: Record<string, string> = { gmv: "gmv", commission: "commission", orders: "orders", joined: "p.joined_at", status: "p.status" };

export function listPartners(sp: SP, per = 10) {
  const where: string[] = [];
  const params: (string | number)[] = [];
  const q = sp1(sp.q).trim();
  if (q) {
    where.push("(p.name LIKE ? OR p.code LIKE ? OR p.email LIKE ? OR p.handle LIKE ?)");
    params.push(...Array(4).fill(`%${q}%`));
  }
  for (const [k, col] of [["tier", "p.tier"], ["status", "p.status"], ["source", "p.channel"], ["region", "p.region"], ["type", "p.type"]] as const) {
    const v = sp1(sp[k]);
    if (v) {
      where.push(`${col} = ?`);
      params.push(v);
    }
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = get<{ n: number }>(`SELECT COUNT(*) n FROM partners p ${w}`, params)!.n;
  const pg = paginate(spInt(sp.page), per, total);
  const sortKey = SORTS[sp1(sp.sort)] ? sp1(sp.sort) : "gmv";
  const dir = sp1(sp.dir) === "asc" ? "ASC" : "DESC";
  const rows = all<PartnerRow>(
    `SELECT p.*,
        COALESCE((SELECT SUM(total) FROM orders o WHERE o.partner_id=p.id AND o.status ${VALID}),0) gmv,
        (SELECT COUNT(*) FROM orders o WHERE o.partner_id=p.id AND o.status ${VALID}) orders,
        COALESCE((SELECT SUM(amount+adjustment) FROM commissions c WHERE c.partner_id=p.id AND c.status!='rejected'),0) commission
       FROM partners p ${w} ORDER BY ${SORTS[sortKey]} ${dir}, p.id LIMIT ? OFFSET ?`,
    [...params, per, pg.offset],
  );
  return { rows, pg, sortKey, dir: dir.toLowerCase() };
}

export function partnerStats() {
  const s = (st?: string) => get<{ n: number }>(`SELECT COUNT(*) n FROM partners ${st ? "WHERE status=?" : ""}`, st ? [st] : [])!.n;
  const prevAt = fmtUtc(localMidnightMs(30));
  const sp = (st?: string) =>
    get<{ n: number }>(`SELECT COUNT(*) n FROM partners WHERE joined_at < ? ${st ? "AND status=?" : ""}`, st ? [prevAt, st] : [prevAt])!.n;
  const mk = (label: string, st?: string) => ({ label, value: s(st), delta: delta(s(st), sp(st)) });
  const sources = all<{ k: string; n: number }>("SELECT COALESCE(channel,'Khác') k, COUNT(*) n FROM partners GROUP BY k ORDER BY n DESC");
  const regions = all<{ k: string; n: number }>("SELECT COALESCE(region,'Khác') k, COUNT(*) n FROM partners GROUP BY k ORDER BY n DESC");
  return {
    kpis: [mk("Tổng đối tác"), mk("Đang hoạt động", "active"), mk("Chờ duyệt", "pending"), mk("Tạm dừng", "suspended")],
    sources, regions, total: s(),
  };
}

export function getPartner(code: string) {
  return get<PartnerRow>(
    `SELECT p.*, 0 gmv, 0 orders, 0 commission FROM partners p WHERE p.code = ?`,
    [code],
  );
}

export function partnerDetail(code: string) {
  const p = getPartner(code);
  if (!p) return null;
  const agg = get<{ gmv: number; orders: number }>(
    `SELECT COALESCE(SUM(total),0) gmv, COUNT(*) orders FROM orders WHERE partner_id=? AND status ${VALID}`, [p.id])!;
  const from = fmtUtc(localMidnightMs(29));
  const prevFrom = fmtUtc(localMidnightMs(59));
  const cur = get<{ gmv: number; orders: number }>(`SELECT COALESCE(SUM(total),0) gmv, COUNT(*) orders FROM orders WHERE partner_id=? AND status ${VALID} AND created_at >= ?`, [p.id, from])!;
  const prev = get<{ gmv: number; orders: number }>(`SELECT COALESCE(SUM(total),0) gmv, COUNT(*) orders FROM orders WHERE partner_id=? AND status ${VALID} AND created_at >= ? AND created_at < ?`, [p.id, prevFrom, from])!;
  const comm = get<{ total: number; pending: number; approved: number; paid: number }>(
    `SELECT COALESCE(SUM(CASE WHEN status!='rejected' THEN amount+adjustment END),0) total,
            COALESCE(SUM(CASE WHEN status='pending' THEN amount END),0) pending,
            COALESCE(SUM(CASE WHEN status IN ('approved','held') THEN amount+adjustment END),0) approved,
            COALESCE(SUM(CASE WHEN status='paid' THEN amount+adjustment END),0) paid FROM commissions WHERE partner_id=?`, [p.id])!;
  const clicks = Math.max(agg.orders * 22, 1);
  const customers = all<{ id: number; name: string; phone: string; orders: number; gmv: number; last: string }>(
    `SELECT c.id, c.name, c.phone, COUNT(o.id) orders, COALESCE(SUM(o.total),0) gmv, MAX(o.created_at) last
       FROM orders o JOIN customers c ON c.id = o.customer_id WHERE o.partner_id=? AND o.status ${VALID} GROUP BY c.id ORDER BY last DESC LIMIT 30`, [p.id]);
  const orders = all<{ id: number; code: string; customer_name: string; total: number; status: string; payment_status: string; created_at: string; items: string | null }>(
    `SELECT o.id, o.code, o.customer_name, o.total, o.status, o.payment_status, o.created_at,
            (SELECT group_concat(name, ', ') FROM order_items WHERE order_id=o.id) items
       FROM orders o WHERE o.partner_id=? ORDER BY o.created_at DESC LIMIT 40`, [p.id]);
  const ledger = all<{ id: number; created_at: string; type: string; code: string; amount: number; rate: number; status: string; paid_at: string | null }>(
    `SELECT c.id, c.created_at, c.status type, o.code, c.amount+c.adjustment amount, c.rate, c.status, po.paid_at
       FROM commissions c JOIN orders o ON o.id=c.order_id LEFT JOIN payouts po ON po.id=c.payout_id
      WHERE c.partner_id=? ORDER BY c.created_at DESC LIMIT 60`, [p.id]);
  const logs = all<{ actor: string; action: string; target: string | null; created_at: string }>(
    `SELECT actor, action, target, created_at FROM activity_logs WHERE target LIKE ? ORDER BY created_at DESC LIMIT 20`, [`%${p.code}%`]);
  const daily = dailySeries(from, 30, "AND partner_id = ?", [p.id]);
  const srcRows = all<{ k: string; n: number }>(
    `SELECT CASE WHEN o.campaign_id IS NOT NULL THEN 'Chiến dịch' WHEN o.source='affiliate' THEN 'Đối tác giới thiệu' ELSE 'Khác' END k, COUNT(DISTINCT customer_id) n
       FROM orders o WHERE partner_id=? AND status ${VALID} GROUP BY k`, [p.id]);
  return {
    p, agg, cur, prev, comm, daily, customers, orders, ledger, logs, srcRows,
    conv: (agg.orders / clicks) * 100,
    custTotal: new Set(customers.map((c) => c.id)).size,
    gmvDelta: delta(cur.gmv, prev.gmv), ordDelta: delta(cur.orders, prev.orders),
  };
}

export function createPartner(d: { name: string; email: string; type: string; source: string; region: string; province: string }) {
  const prefix = d.type === "ctv" ? "CTV" : d.type === "agency" ? "DL" : "AFF";
  let code = "";
  do code = `${prefix}${String(Math.floor(1500 + Math.random() * 8000)).padStart(6, "0")}`;
  while (get("SELECT 1 FROM partners WHERE code=?", [code]));
  const handle = d.email.split("@")[0].replace(/[^a-z0-9_]/gi, "").toLowerCase() + "_aff";
  run(
    `INSERT INTO partners (code,name,handle,email,channel,tier,status,commission_rate,region,type,province,owner)
     VALUES (?,?,?,?,?,'bronze','pending',8,?,?,?, 'Trần Quốc Bảo')`,
    [code, d.name, handle, d.email, d.source, d.region, d.type, d.province],
  );
  return code;
}

export function setPartnerStatus(code: string, status: "active" | "suspended" | "pending") {
  run("UPDATE partners SET status=? WHERE code=?", [status, code]);
}
export function updatePartner(code: string, d: { name: string; email: string; phone: string; tier: string; rate: number; type: string; source: string; region: string; province: string }) {
  run(
    "UPDATE partners SET name=?, email=?, phone=?, tier=?, commission_rate=?, type=?, channel=?, region=?, province=? WHERE code=?",
    [d.name, d.email, d.phone, d.tier, d.rate, d.type, d.source, d.region, d.province, code],
  );
}
export function bulkApprove() {
  tx(() => run("UPDATE partners SET status='active' WHERE status='pending'"));
}
