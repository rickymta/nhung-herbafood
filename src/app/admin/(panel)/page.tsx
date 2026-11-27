import Link from "next/link";
import { AlertTriangle, Briefcase, Coins, Handshake, Repeat, ShoppingBag, TrendingUp, ArrowUp, ArrowDown, Users, UserRound } from "lucide-react";
import { getOverview, getAlerts } from "@/lib/admin/dashboard";
import { parseRange, rangeText, SOURCE_LABEL, delta, type SP } from "@/lib/admin/common";
import { Avatar, Card, Kpi, PageHeader, href } from "@/components/admin/ui";
import { Donut, GmvChart } from "@/components/admin/charts";
import { num, vndAdmin } from "@/lib/format";

const COLORS: Record<string, string> = { affiliate: "#0f9d74", website: "#3b82f6", campaign: "#f59e0b", other: "#94a3b8" };
const ICONS = [ShoppingBag, Handshake, Coins, Briefcase, Repeat];

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const sp = (await searchParams) as SP;
  const r = parseRange(sp.range);
  const o = getOverview(r);
  const alerts = getAlerts();
  const total = o.sources.reduce((s, x) => s + x.gmv, 0);
  const compact = total >= 1e9 ? `${num(total / 1e9, 2)} Tỷ ₫` : `${num(total / 1e6, 1)} Tr ₫`;
  const q = (k: string, a: number, b: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: "1px solid var(--line2)" }}>
      <span style={{ flex: 1, color: "var(--muted)", fontWeight: 600 }}>{k}</span>
      <b style={{ fontSize: 17 }}>{num(a)}</b>
      {(() => { const d = delta(a, b); return d === null ? null : <span className={d >= 0 ? "up" : "dn"} style={{ fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center" }}>{d >= 0 ? <ArrowUp size={13} /> : <ArrowDown size={13} />}{d >= 0 ? "+" : ""}{num(d, 1)}%</span>; })()}
    </div>
  );
  return (
    <>
      <PageHeader title="Tổng quan điều hành" sub="Hiệu quả chương trình Affiliate toàn hệ thống">
        <div className="adm-seg">
          {[7, 30, 90].map((d) => (
            <Link key={d} href={href("/admin", sp, { range: d === 30 ? null : d })} className={r.days === d ? "on" : ""}>{d} ngày</Link>
          ))}
        </div>
        <span style={{ color: "var(--muted)", fontSize: 14, fontWeight: 600 }}>{rangeText(r)}</span>
      </PageHeader>

      <div className="adm-grid adm-g5">
        {o.kpis.map((k, i) => {
          const Icon = ICONS[i];
          return <Kpi key={k.key} label={k.label} value={k.value} kind={k.kind} delta={k.delta} deltaPts={k.deltaPts} spark={k.spark} icon={<Icon size={18} />} deltaLabel={`so với ${r.days} ngày trước`} />;
        })}
      </div>

      <div className="adm-grid adm-g21">
        <Card>
          <GmvChart title="Doanh số & Đơn hàng theo thời gian" daily={o.daily} weekly={o.weekly} />
        </Card>
        <Card title="Nguồn doanh số (GMV)">
          <Donut items={o.sources.map((s) => ({ name: SOURCE_LABEL[s.key], value: s.gmv, color: COLORS[s.key] }))} center={compact} sub="Tổng GMV" />
          <div style={{ marginTop: 14 }}>
            {o.sources.map((s) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", fontSize: 13.5 }}>
                <span className="adm-dot" style={{ background: COLORS[s.key] }} />
                <span style={{ flex: 1 }}>{SOURCE_LABEL[s.key]}</span>
                <b>{vndAdmin(s.gmv)}</b>
                <span style={{ color: "var(--muted)", width: 52, textAlign: "right" }}>{total ? num((s.gmv / total) * 100, 1) : "0"}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="adm-grid adm-g21">
        <Card flush title="Top 5 Đối tác có doanh số cao nhất" more={{ href: "/admin/partners", label: "Xem tất cả" }}>
          <div className="adm-tblwrap">
            <table className="adm-tbl">
              <thead><tr><th>#</th><th>Đối tác</th><th className="r">Doanh số (GMV)</th><th className="r">Đơn hàng</th><th className="r">Hoa hồng dự kiến</th></tr></thead>
              <tbody>
                {o.top.map((p, i) => (
                  <tr key={p.code}>
                    <td>{i + 1}</td>
                    <td>
                      <Link href={`/admin/partners/${p.code}`} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <Avatar name={p.name} i={i} sm />
                        <span><b>{p.name}</b><br /><span className="mut">@{p.handle}</span></span>
                      </Link>
                    </td>
                    <td className="r">{vndAdmin(p.gmv)}</td><td className="r">{num(p.orders)}</td><td className="r">{vndAdmin(p.commission)}</td>
                  </tr>
                ))}
                {!o.top.length && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 24 }}>Chưa có đơn từ đối tác trong kỳ.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <Card title="Cảnh báo cần xử lý" more={{ href: "/admin/orders?status=pending", label: "Xem tất cả" }}>
            {alerts.length === 0 && <p style={{ color: "var(--muted)", margin: 0 }}>Mọi thứ đang ổn.</p>}
            <div className="adm-list">
              {alerts.map((a) => (
                <div key={a.key}>
                  <span className="adm-ic" style={{ width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center", background: a.tone === "red" ? "#fee2e2" : a.tone === "blue" ? "#dbeafe" : "#ffedd5", color: a.tone === "red" ? "#b91c1c" : a.tone === "blue" ? "#1d4ed8" : "#c2410c", flex: "none" }}><AlertTriangle size={17} /></span>
                  <Link href={a.href} style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{a.title}</div><div style={{ color: "var(--muted)", fontSize: 13 }}>{a.desc}</div></Link>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Tổng quan nhanh">
            {q("Đối tác", o.quick.partners, o.quick.partnersPrev)}
            {q("Khách hàng", o.quick.customers, o.quick.customersPrev)}
            <div style={{ display: "flex", gap: 12, padding: "11px 0", borderTop: "1px solid var(--line2)" }}><span style={{ flex: 1, color: "var(--muted)", fontWeight: 600 }}>Chiến dịch đang chạy</span><b style={{ fontSize: 17 }}>{o.quick.campaigns}</b></div>
          </Card>
        </div>
      </div>

      <div className="adm-card" style={{ display: "flex", gap: 22, flexWrap: "wrap", color: "var(--muted)", fontSize: 13.5, padding: "12px 18px" }}>
        <span><Users size={14} style={{ verticalAlign: -2 }} /> <b style={{ color: "var(--text)" }}>{o.pendingApps}</b> hồ sơ đăng ký chờ xử lý</span>
        <span><TrendingUp size={14} style={{ verticalAlign: -2 }} /> Chính sách áp dụng: <b style={{ color: "var(--text)" }}>{o.policy}</b></span>
        <span><UserRound size={14} style={{ verticalAlign: -2 }} /> Khoảng thời gian: {r.days} ngày</span>
      </div>
    </>
  );
}
