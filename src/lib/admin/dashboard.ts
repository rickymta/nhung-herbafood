import "server-only";
import { all, get } from "../db";
import { dayOf, VALID, delta, ddmm, fmtUtc, localMidnightMs, TZ_OFFSET_H, campaignState, type Range } from "./common";

type Agg = { gmv: number; orders: number };
const aggRange = (from: string, to: string) =>
  get<Agg>(
    `SELECT COALESCE(SUM(total),0) gmv, COUNT(*) orders FROM orders WHERE status ${VALID} AND created_at >= ? AND created_at < ?`,
    [from, to],
  )!;
const commRange = (from: string, to: string) =>
  get<{ s: number }>(`SELECT COALESCE(SUM(amount+adjustment),0) s FROM commissions WHERE status != 'rejected' AND created_at >= ? AND created_at < ?`, [from, to])!.s;
const activeP = (from: string, to: string) =>
  get<{ n: number }>(
    `SELECT COUNT(DISTINCT partner_id) n FROM orders WHERE partner_id IS NOT NULL AND status ${VALID} AND created_at >= ? AND created_at < ?`,
    [from, to],
  )!.n;
const repeatRate = (from: string, to: string) => {
  const r = get<{ a: number; b: number }>(
    `SELECT COUNT(*) a, SUM(CASE WHEN n >= 2 THEN 1 ELSE 0 END) b FROM (
       SELECT o.customer_id, (SELECT COUNT(*) FROM orders x WHERE x.customer_id = o.customer_id AND x.status ${VALID} AND x.created_at < ?) n
         FROM orders o WHERE o.status ${VALID} AND o.created_at >= ? AND o.created_at < ? AND o.customer_id IS NOT NULL GROUP BY o.customer_id)`,
    [to, from, to],
  )!;
  return r.a ? ((r.b ?? 0) / r.a) * 100 : 0;
};

export type DayPoint = { day: string; label: string; gmv: number; orders: number };

export function dailySeries(from: string, days: number, where = "", params: (string | number)[] = []): DayPoint[] {
  const to = fmtUtc(Date.parse(from.replace(" ", "T") + "Z") + days * 86400e3);
  const rows = all<{ d: string; gmv: number; n: number }>(
    `SELECT ${dayOf("created_at")} d, SUM(total) gmv, COUNT(*) n FROM orders
      WHERE status ${VALID} AND created_at >= ? AND created_at < ? ${where} GROUP BY d`,
    [from, to, ...params],
  );
  const m = new Map(rows.map((r) => [r.d, r]));
  const out: DayPoint[] = [];
  const startLocal = Date.parse(from.replace(" ", "T") + "Z") + TZ_OFFSET_H * 3600e3;
  for (let i = 0; i < days; i++) {
    const day = new Date(startLocal + i * 86400e3).toISOString().slice(0, 10);
    const r = m.get(day);
    out.push({ day, label: ddmm(day), gmv: r?.gmv ?? 0, orders: r?.n ?? 0 });
  }
  return out;
}
export function weeklySeries(daily: DayPoint[]): DayPoint[] {
  const out: DayPoint[] = [];
  for (let i = 0; i < daily.length; i += 7) {
    const ch = daily.slice(i, i + 7);
    out.push({ day: ch[0].day, label: ddmm(ch[0].day), gmv: ch.reduce((s, x) => s + x.gmv, 0), orders: ch.reduce((s, x) => s + x.orders, 0) });
  }
  return out;
}

export type Kpi = { key: string; label: string; value: number; kind: "vnd" | "num" | "pct"; delta: number | null; deltaPts?: boolean; spark: number[] };

export function getOverview(r: Range) {
  const cur = aggRange(r.from, r.to);
  const prev = aggRange(r.prevFrom, r.from);
  const cCur = commRange(r.from, r.to);
  const cPrev = commRange(r.prevFrom, r.from);
  const pCur = activeP(r.from, r.to);
  const pPrev = activeP(r.prevFrom, r.from);
  const rrCur = repeatRate(r.from, r.to);
  const rrPrev = repeatRate(r.prevFrom, r.from);
  const daily = dailySeries(r.from, r.days);
  const activePartners = get<{ n: number }>("SELECT COUNT(*) n FROM partners WHERE status='active'")!.n;
  const kpis: Kpi[] = [
    { key: "gmv", label: "Doanh số GMV", value: cur.gmv, kind: "vnd", delta: delta(cur.gmv, prev.gmv), spark: daily.map((d) => d.gmv) },
    { key: "partners", label: "Đối tác hoạt động", value: activePartners, kind: "num", delta: delta(pCur, pPrev), spark: daily.map((d) => d.orders) },
    { key: "comm", label: "Hoa hồng phải trả", value: cCur, kind: "vnd", delta: delta(cCur, cPrev), spark: daily.map((d) => Math.round(d.gmv * 0.1)) },
    { key: "orders", label: "Đơn hàng hợp lệ", value: cur.orders, kind: "num", delta: delta(cur.orders, prev.orders), spark: daily.map((d) => d.orders) },
    { key: "repeat", label: "Tỷ lệ tái mua", value: rrCur, kind: "pct", delta: rrCur - rrPrev, deltaPts: true, spark: daily.map((d) => d.orders) },
  ];

  const src = all<{ k: string; gmv: number }>(
    `SELECT CASE WHEN partner_id IS NOT NULL THEN 'affiliate' WHEN source='campaign' THEN 'campaign' WHEN source='website' THEN 'website' ELSE 'other' END k,
            SUM(total) gmv FROM orders WHERE status ${VALID} AND created_at >= ? AND created_at < ? GROUP BY k`,
    [r.from, r.to],
  );
  const order = ["affiliate", "website", "campaign", "other"];
  const sources = order.map((k) => ({ key: k, gmv: src.find((s) => s.k === k)?.gmv ?? 0 }));

  const top = all<{ code: string; name: string; handle: string; gmv: number; orders: number; commission: number }>(
    `SELECT p.code, p.name, p.handle, SUM(o.total) gmv, COUNT(*) orders,
            COALESCE((SELECT SUM(c.amount) FROM commissions c JOIN orders x ON x.id=c.order_id WHERE c.partner_id=p.id AND c.status!='rejected' AND x.created_at >= ? AND x.created_at < ?),0) commission
       FROM orders o JOIN partners p ON p.id = o.partner_id
      WHERE o.status ${VALID} AND o.created_at >= ? AND o.created_at < ? GROUP BY p.id ORDER BY gmv DESC LIMIT 5`,
    [r.from, r.to, r.from, r.to],
  );

  const quick = {
    partners: get<{ n: number }>("SELECT COUNT(*) n FROM partners")!.n,
    partnersPrev: get<{ n: number }>("SELECT COUNT(*) n FROM partners WHERE joined_at < ?", [r.from])!.n,
    customers: get<{ n: number }>("SELECT COUNT(*) n FROM customers")!.n,
    customersPrev: get<{ n: number }>("SELECT COUNT(*) n FROM customers WHERE created_at < ?", [r.from])!.n,
    campaigns: get<{ n: number }>("SELECT COUNT(*) n FROM campaigns WHERE status='active' AND start_date <= date('now','+7 hours') AND end_date >= date('now','+7 hours')")!.n,
  };
  const pendingApps = get<{ n: number }>("SELECT COUNT(*) n FROM partners WHERE status='pending'")!.n;
  const policy = get<{ value: string }>("SELECT value FROM settings WHERE key='policy_version'")?.value ?? "v1.3";
  return { kpis, daily, weekly: weeklySeries(daily), sources, top, quick, pendingApps, policy, total: cur.gmv };
}

export type AlertItem = { key: string; title: string; desc: string; href: string; count: number; tone: "red" | "orange" | "amber" | "blue" };
export function getAlerts(): AlertItem[] {
  const cutoff = fmtUtc(Date.now() - 24 * 3600e3);
  const pending = get<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE status='pending' AND created_at < ?", [cutoff])!.n;
  const pendingAll = get<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE status='pending'")!.n;
  const apps = get<{ n: number }>("SELECT COUNT(*) n FROM partners WHERE status='pending'")!.n;
  const big = get<{ n: number }>(
    `SELECT COUNT(*) n FROM (SELECT partner_id FROM commissions WHERE status IN ('pending','approved','held') GROUP BY partner_id HAVING SUM(amount) > 5000000)`,
  )!.n;
  const errs = get<{ n: number }>("SELECT COUNT(*) n FROM orders WHERE sync_status='error'")!.n;
  const camps = all<{ name: string; status: string; start_date: string; end_date: string }>("SELECT name,status,start_date,end_date FROM campaigns");
  const ending = camps.filter((c) => {
    if (campaignState(c) !== "running") return false;
    const left = (Date.parse(c.end_date) + 86400e3 - (Date.now() + TZ_OFFSET_H * 3600e3)) / 86400e3;
    return left <= 3;
  });
  const items: AlertItem[] = [];
  if (pending > 0) items.push({ key: "orders24", title: `${pending} đơn hàng chờ xác nhận quá 24 giờ`, desc: "Cần xử lý để không ảnh hưởng đối soát hoa hồng", href: "/admin/orders?status=pending", count: pending, tone: "orange" });
  else if (pendingAll > 0) items.push({ key: "orders", title: `${pendingAll} đơn hàng chờ xác nhận`, desc: "Đơn mới phát sinh trong 24 giờ qua", href: "/admin/orders?status=pending", count: pendingAll, tone: "blue" });
  if (apps > 0) items.push({ key: "apps", title: `${apps} hồ sơ đối tác chờ duyệt`, desc: "Xác minh và phê duyệt đối tác mới", href: "/admin/partners?status=pending", count: apps, tone: "amber" });
  if (big > 0) items.push({ key: "big", title: `${big} đối tác có hoa hồng chưa chi > 5 triệu`, desc: "Cần soát xét & phê duyệt thanh toán", href: "/admin/commission", count: big, tone: "red" });
  if (errs > 0) items.push({ key: "sync", title: `${errs} đơn lỗi đồng bộ TN MALL`, desc: "Kiểm tra log webhook & đồng bộ lại", href: "/admin/integration", count: errs, tone: "red" });
  for (const c of ending) items.push({ key: "camp" + c.name, title: `1 chiến dịch sắp kết thúc`, desc: `“${c.name}” – kết thúc ${c.end_date.split("-").reverse().join("/")}`, href: "/admin/campaigns", count: 1, tone: "amber" });
  return items;
}

/* ---------------- reports ---------------- */
export function getReports() {
  const byMonth = all<{ m: string; gmv: number; orders: number; aov: number; comm: number }>(
    `SELECT strftime('%Y-%m', created_at, '+7 hours') m, SUM(total) gmv, COUNT(*) orders, AVG(total) aov,
            COALESCE((SELECT SUM(c.amount) FROM commissions c JOIN orders x ON x.id=c.order_id WHERE c.status!='rejected' AND strftime('%Y-%m', x.created_at,'+7 hours') = strftime('%Y-%m', o.created_at,'+7 hours')),0) comm
       FROM orders o WHERE status ${VALID} GROUP BY m ORDER BY m`,
  );
  const byProduct = all<{ name: string; qty: number; gmv: number; orders: number }>(
    `SELECT i.name, SUM(i.quantity) qty, SUM(i.price*i.quantity) gmv, COUNT(DISTINCT i.order_id) orders
       FROM order_items i JOIN orders o ON o.id=i.order_id WHERE o.status ${VALID} GROUP BY i.name ORDER BY gmv DESC LIMIT 10`,
  );
  const byTier = all<{ tier: string; partners: number; gmv: number; orders: number; comm: number }>(
    `SELECT p.tier, COUNT(DISTINCT p.id) partners, COALESCE(SUM(o.total),0) gmv, COUNT(o.id) orders,
            COALESCE((SELECT SUM(c.amount) FROM commissions c JOIN partners q ON q.id=c.partner_id WHERE q.tier=p.tier AND c.status!='rejected'),0) comm
       FROM partners p LEFT JOIN orders o ON o.partner_id=p.id AND o.status ${VALID} WHERE p.status='active' GROUP BY p.tier`,
  );
  const byProvince = all<{ province: string; gmv: number; orders: number; customers: number }>(
    `SELECT COALESCE(province,'Khác') province, SUM(total) gmv, COUNT(*) orders, COUNT(DISTINCT customer_id) customers
       FROM orders WHERE status ${VALID} GROUP BY province ORDER BY gmv DESC LIMIT 12`,
  );
  const totals = get<{ gmv: number; orders: number }>(`SELECT COALESCE(SUM(total),0) gmv, COUNT(*) orders FROM orders WHERE status ${VALID}`)!;
  const counts = {
    commissions: get<{ n: number }>("SELECT COUNT(*) n FROM commissions")!.n,
    audit: get<{ n: number }>("SELECT COUNT(*) n FROM activity_logs")!.n,
    campaigns: get<{ n: number }>("SELECT COUNT(*) n FROM campaigns")!.n,
  };
  const daily = dailySeries(fmtUtc(localMidnightMs(89)), 90);
  return { byMonth, byProduct, byTier, byProvince, totals, counts, daily, weekly: weeklySeries(daily) };
}
