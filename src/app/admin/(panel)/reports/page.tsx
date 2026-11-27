import { getReports } from "@/lib/admin/dashboard";
import { TIER_LABEL } from "@/lib/admin/common";
import { Card, Kpi, Note, PageHeader } from "@/components/admin/ui";
import { GmvChart, MixChart } from "@/components/admin/charts";
import { Coins, ListChecks, Megaphone, ScrollText } from "lucide-react";
import { num, vndAdmin } from "@/lib/format";

export default function ReportsPage() {
  const r = getReports();
  const mlabel = (m: string) => `T${m.slice(5)}/${m.slice(0, 4)}`;
  return (
    <>
      <PageHeader title="Báo cáo" sub="Tổng hợp hiệu quả chương trình theo tháng, sản phẩm, cấp bậc đối tác và tỉnh/thành" />
      <Note tone="info">Báo cáo được tính trực tiếp từ dữ liệu SQLite (đơn hợp lệ = không tính đơn hủy / hoàn trả).</Note>
      <div className="adm-grid adm-g4">
        <Kpi label="GMV toàn kỳ" kind="vnd" value={r.totals.gmv} icon={<Coins size={18} />} sub={`${num(r.totals.orders)} đơn hợp lệ`} />
        <Kpi label="Bút toán hoa hồng" value={r.counts.commissions} icon={<ListChecks size={18} />} sub="Ledger hoa hồng" />
        <Kpi label="Chiến dịch" value={r.counts.campaigns} icon={<Megaphone size={18} />} sub="Đã tạo" />
        <Kpi label="Sự kiện audit" value={r.counts.audit} icon={<ScrollText size={18} />} sub="Nhật ký kiểm toán" />
      </div>
      <Card><GmvChart title="Doanh số & đơn hàng (90 ngày)" daily={r.daily} weekly={r.weekly} /></Card>

      <div className="adm-grid adm-g2" style={{ marginTop: 16 }}>
        <Card flush title="Theo tháng">
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Tháng</th><th className="r">GMV</th><th className="r">Đơn</th><th className="r">AOV</th><th className="r">Hoa hồng</th></tr></thead>
            <tbody>{r.byMonth.map((m) => <tr key={m.m}><td>{mlabel(m.m)}</td><td className="r">{vndAdmin(m.gmv)}</td><td className="r">{num(m.orders)}</td><td className="r">{vndAdmin(m.aov)}</td><td className="r">{vndAdmin(m.comm)}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="GMV theo tháng (triệu đ)">
          <MixChart xKey="m" height={240} data={r.byMonth.map((m) => ({ m: mlabel(m.m), gmv: Math.round(m.gmv / 1e5) / 10, orders: m.orders }))} bars={[{ key: "gmv", name: "GMV (triệu đ)", color: "#10b981" }]} lines={[{ key: "orders", name: "Đơn hàng", color: "#3b82f6", axis: "r" }]} />
        </Card>
      </div>

      <div className="adm-grid adm-g2">
        <Card flush title="Theo sản phẩm (top 10)">
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>#</th><th>Sản phẩm</th><th className="r">SL bán</th><th className="r">Đơn</th><th className="r">Doanh số</th></tr></thead>
            <tbody>{r.byProduct.map((p, i) => <tr key={p.name}><td>{i + 1}</td><td>{p.name}</td><td className="r">{num(p.qty)}</td><td className="r">{num(p.orders)}</td><td className="r">{vndAdmin(p.gmv)}</td></tr>)}
              {!r.byProduct.length && <tr><td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Chưa có dữ liệu.</td></tr>}</tbody></table></div>
        </Card>
        <Card flush title="Theo cấp bậc đối tác">
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Cấp bậc</th><th className="r">Đối tác</th><th className="r">Đơn</th><th className="r">GMV</th><th className="r">Hoa hồng</th></tr></thead>
            <tbody>{r.byTier.map((t) => <tr key={t.tier}><td><b>{TIER_LABEL[t.tier] ?? t.tier}</b></td><td className="r">{t.partners}</td><td className="r">{num(t.orders)}</td><td className="r">{vndAdmin(t.gmv)}</td><td className="r">{vndAdmin(t.comm)}</td></tr>)}</tbody></table></div>
        </Card>
      </div>

      <Card flush title="Theo tỉnh / thành phố">
        <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>#</th><th>Tỉnh/TP</th><th className="r">Khách hàng</th><th className="r">Đơn</th><th className="r">GMV</th><th style={{ width: "30%" }}>Tỷ trọng</th></tr></thead>
          <tbody>{r.byProvince.map((p, i) => <tr key={p.province}><td>{i + 1}</td><td>{p.province}</td><td className="r">{p.customers}</td><td className="r">{num(p.orders)}</td><td className="r">{vndAdmin(p.gmv)}</td><td><div className="adm-prog"><i style={{ width: `${r.totals.gmv ? (p.gmv / r.totals.gmv) * 100 : 0}%` }} /></div></td></tr>)}</tbody></table></div>
      </Card>
    </>
  );
}
