import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bell, Coins, Copy, FileText, Lock, Pencil, Percent, ShoppingBag, ShoppingCart, Unlock } from "lucide-react";
import { partnerDetail } from "@/lib/admin/partners";
import { COMM_STATUS, ORDER_STATUS, PARTNER_STATUS, PAY_STATUS, TYPE_LABEL, maskPhone, type SP, sp1 } from "@/lib/admin/common";
import { Card, Kpi, Note, PageHeader, StatusBadge, TierBadge, Tabs, href } from "@/components/admin/ui";
import { Donut, GmvChart } from "@/components/admin/charts";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { notifyPartnerAction, partnerStatusAction } from "../actions";
import { weeklySeries } from "@/lib/admin/dashboard";
import { headers } from "next/headers";

const TABS = [
  { key: "overview", label: "Tổng quan" }, { key: "customers", label: "Khách hàng" }, { key: "orders", label: "Đơn hàng" },
  { key: "commission", label: "Hoa hồng" }, { key: "docs", label: "Tài liệu" }, { key: "log", label: "Nhật ký" },
];

export default async function PartnerDetail({ params, searchParams }: PageProps<"/admin/partners/[code]">) {
  const { code } = await params;
  const sp = (await searchParams) as SP;
  const d = partnerDetail(decodeURIComponent(code));
  if (!d) notFound();
  const { p } = d;
  const tab = sp1(sp.tab) || "overview";
  const base = `/admin/partners/${p.code}`;
  const refLink = `/?ref=${p.code}`;
  const bank = p.bank_account ? `•••• •••• ${p.bank_account.slice(-4)}` : "—";
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  return (
    <>
      <PageHeader title="Chi tiết hồ sơ đối tác" sub="Thông tin định danh, hiệu suất, khách hàng và lịch sử giao dịch">
        <Link className="adm-btn" href="/admin/partners"><ArrowLeft size={16} /> Danh sách</Link>
      </PageHeader>

      <Card>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{p.code} – {p.name}</h2>
            <TierBadge tier={p.tier} />
            <StatusBadge status={p.status} label={PARTNER_STATUS[p.status]} />
          </div>
          <div className="adm-acts">
            <Link className="adm-btn" href={`/admin/partners?edit=${p.code}`}><Pencil size={15} /> Chỉnh sửa hồ sơ</Link>
            <form action={partnerStatusAction}>
              <input type="hidden" name="code" value={p.code} /><input type="hidden" name="_back" value={base} />
              <input type="hidden" name="status" value={p.status === "active" ? "suspended" : "active"} />
              <button className={`adm-btn ${p.status === "active" ? "d" : "p"}`}>{p.status === "active" ? <><Lock size={15} /> Khóa tạm thời</> : <><Unlock size={15} /> {p.status === "pending" ? "Duyệt hồ sơ" : "Kích hoạt lại"}</>}</button>
            </form>
            <form action={notifyPartnerAction}><input type="hidden" name="code" value={p.code} /><button className="adm-btn"><Bell size={15} /> Gửi thông báo</button></form>
          </div>
        </div>
        <dl className="adm-kv" style={{ marginTop: 16, gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
          {[
            ["Số điện thoại", maskPhone(p.phone) || "—"], ["Email", p.email ?? "—"], ["Khu vực", p.province ?? p.region ?? "—"], ["Ngày đăng ký", dateVN(p.joined_at)],
            ["Người phụ trách", p.owner ?? "—"], ["Kênh nguồn", p.channel ?? "—"], ["Loại", TYPE_LABEL[p.type] ?? p.type], ["Tỷ lệ hoa hồng", `${p.commission_rate}%`],
          ].map(([k, v]) => <div key={k}><dt style={{ color: "var(--muted)", fontSize: 13 }}>{k}</dt><dd style={{ margin: 0, fontWeight: 600 }}>{v}</dd></div>)}
        </dl>
      </Card>

      <div style={{ height: 16 }} />
      <Tabs items={TABS} active={tab} base={base} sp={sp} />

      {tab === "overview" && (
        <>
          <div className="adm-grid adm-g4">
            <Kpi icon={<ShoppingBag size={18} />} label="GMV" kind="vnd" value={d.agg.gmv} delta={d.gmvDelta} deltaLabel="so với 30 ngày trước" />
            <Kpi icon={<ShoppingCart size={18} />} label="Đơn hàng" value={d.agg.orders} delta={d.ordDelta} deltaLabel="so với 30 ngày trước" />
            <Kpi icon={<Coins size={18} />} label="Hoa hồng ước tính" kind="vnd" value={d.comm.total} sub="Tổng hoa hồng (không gồm bị từ chối)" />
            <Kpi icon={<Percent size={18} />} label="Tỷ lệ chuyển đổi" kind="pct" value={d.conv} sub="Ước tính theo lượt nhấp" />
          </div>
          <div className="adm-grid adm-g21">
            <Card><GmvChart title="Xu hướng doanh số (GMV) — 30 ngày gần nhất" daily={d.daily} weekly={weeklySeries(d.daily)} height={260} /></Card>
            <Card title="Nguồn khách hàng">
              <Donut center={num(d.custTotal)} sub="Khách hàng" items={d.srcRows.map((s, i) => ({ name: s.k, value: s.n, color: ["#0f9d74", "#3b82f6", "#f59e0b", "#94a3b8"][i % 4] }))} />
              <div style={{ marginTop: 12 }}>{d.srcRows.map((s, i) => <div key={s.k} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 0" }}><span className="adm-dot" style={{ background: ["#0f9d74", "#3b82f6", "#f59e0b", "#94a3b8"][i % 4] }} /><span style={{ flex: 1 }}>{s.k}</span><b>{s.n}</b></div>)}</div>
            </Card>
          </div>
          <div className="adm-grid adm-g21">
            <Card flush title="Danh sách khách hàng gần đây">
              <CustomerTable rows={d.customers.slice(0, 6)} />
            </Card>
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <Card title="Thông tin ngân hàng">
                <dl className="adm-kv" style={{ gridTemplateColumns: "110px 1fr" }}><dt>Ngân hàng</dt><dd>{p.bank_name ?? "—"}</dd><dt>Số tài khoản</dt><dd>{bank}</dd><dt>Chủ tài khoản</dt><dd>{p.name.toUpperCase()}</dd></dl>
              </Card>
              <Card title="Mã giới thiệu liên kết">
                <div style={{ fontWeight: 800, fontSize: 18 }}>{p.code}</div>
                <div className="adm-input" style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", background: "#f8fafc" }}><Copy size={14} /><code style={{ fontSize: 13, wordBreak: "break-all" }}>{`${origin}${refLink}`}</code></div>
                <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 6 }}>Gắn <code>?ref={p.code}</code> vào bất kỳ URL cửa hàng. Cookie lưu 30 ngày.</div>
              </Card>
              <Card title="Hoạt động gần đây">
                <div className="adm-tl">
                  {d.orders.slice(0, 4).map((o) => <div key={o.code}><b>Đơn {o.code}</b> – {vndAdmin(o.total)}<div style={{ color: "var(--muted)", fontSize: 12.5 }}>{ORDER_STATUS[o.status]} · {dateVN(o.created_at, true)}</div></div>)}
                  {!d.orders.length && <div style={{ color: "var(--muted)" }}>Chưa có hoạt động.</div>}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {tab === "customers" && (
        <Card flush title={`${d.custTotal} khách hàng được ghi nhận`}>
          <p style={{ margin: "0 18px 8px", color: "var(--muted)" }}>Ghi nhận khách ≠ quyền hưởng hoa hồng vô hạn.</p>
          <CustomerTable rows={d.customers} />
        </Card>
      )}

      {tab === "orders" && (
        <Card flush title="Đơn hàng của đối tác">
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th className="r">Giá trị</th><th>Thanh toán</th><th>Giao hàng</th><th>Thời gian</th></tr></thead>
            <tbody>{d.orders.map((o) => (
              <tr key={o.code}>
                <td><Link className="lnk" href={`/admin/orders?view=${o.code}`}>{o.code}</Link></td><td>{o.customer_name}</td>
                <td style={{ maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items}</td><td className="r">{vndAdmin(o.total)}</td>
                <td><StatusBadge sq status={o.payment_status} label={PAY_STATUS[o.payment_status] ?? o.payment_status} /></td>
                <td><StatusBadge sq status={o.status} label={ORDER_STATUS[o.status]} /></td><td>{dateVN(o.created_at, true)}</td>
              </tr>))}
              {!d.orders.length && <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Chưa có đơn hàng.</td></tr>}
            </tbody></table></div>
        </Card>
      )}

      {tab === "commission" && (
        <Card flush title="Sổ hoa hồng (ledger)" action={<b>Chưa chi: {vndAdmin(d.comm.approved + d.comm.pending)} · Đã chi: {vndAdmin(d.comm.paid)}</b>}>
          <p style={{ margin: "0 18px 8px", color: "var(--muted)" }}>Bút toán chỉ được thêm (accrual / reversal / payout). Điều chỉnh thực hiện ở trang Hoa hồng & Đối soát.</p>
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>Thời gian</th><th>Loại</th><th>Đơn</th><th>Diễn giải</th><th>Trạng thái</th><th className="r">Số tiền</th></tr></thead>
            <tbody>{d.ledger.map((l) => (
              <tr key={l.id}>
                <td>{dateVN(l.created_at, true)}</td>
                <td><code>{l.status === "rejected" ? "REVERSAL" : l.status === "paid" ? "PAYOUT" : "ACCRUAL"}</code></td>
                <td>{l.code}</td><td>Hoa hồng {l.rate}% trên đơn {l.code}</td>
                <td><StatusBadge status={l.status} label={COMM_STATUS[l.status]} sq /></td>
                <td className="r" style={{ color: l.status === "rejected" ? "#b91c1c" : undefined }}>{l.status === "rejected" ? "-" : ""}{vndAdmin(l.amount)}</td>
              </tr>))}
              {!d.ledger.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Chưa có bút toán.</td></tr>}
            </tbody></table></div>
        </Card>
      )}

      {tab === "docs" && (
        <Card title="Tài liệu">
          <Note>Giấy tờ định danh lưu ở kho tệp mã hóa (chưa triển khai — placeholder). Không lưu giấy tờ thật.</Note>
          {[["Hợp đồng đối tác (mẫu).pdf", "482 KB"], ["Phụ lục chính sách v1.3.pdf", "210 KB"]].map(([n, s]) => (
            <div key={n} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line2)" }}><FileText size={18} /> <span style={{ flex: 1, fontWeight: 600 }}>{n}</span><span style={{ color: "var(--muted)" }}>{s}</span></div>
          ))}
        </Card>
      )}

      {tab === "log" && (
        <Card flush title="Nhật ký kiểm toán">
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Chi tiết</th></tr></thead>
            <tbody>{d.logs.map((l, i) => <tr key={i}><td>{dateVN(l.created_at, true)}</td><td>{l.actor}</td><td><code>{l.action}</code></td><td>{l.target}</td></tr>)}
              {!d.logs.length && <tr><td colSpan={4} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Chưa có nhật ký cho đối tác này.</td></tr>}</tbody></table></div>
        </Card>
      )}
      <span hidden>{href(base, sp)}</span>
    </>
  );
}

function CustomerTable({ rows }: { rows: { id: number; name: string; phone: string; orders: number; gmv: number; last: string }[] }) {
  return (
    <div className="adm-tblwrap"><table className="adm-tbl">
      <thead><tr><th>#</th><th>Khách hàng</th><th>Số điện thoại</th><th className="r">Đơn hàng</th><th className="r">Doanh số (GMV)</th><th>Ngày phát sinh</th></tr></thead>
      <tbody>{rows.map((c, i) => <tr key={c.id}><td>{i + 1}</td><td><b>{c.name}</b></td><td>{maskPhone(c.phone)}</td><td className="r">{c.orders}</td><td className="r">{vndAdmin(c.gmv)}</td><td>{dateVN(c.last)}</td></tr>)}
        {!rows.length && <tr><td colSpan={6} style={{ textAlign: "center", padding: 24, color: "var(--muted)" }}>Chưa có khách hàng.</td></tr>}</tbody></table></div>
  );
}
