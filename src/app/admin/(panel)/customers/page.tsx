import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { customerStats, getCustomer, listCustomers } from "@/lib/admin/customers";
import { ORDER_STATUS, SEGMENT_LABEL, maskPhone, type SP, sp1 } from "@/lib/admin/common";
import { Badge, Card, Delta, Field, Modal, PageHeader, Pagination, StatusBadge, href, DownloadLink } from "@/components/admin/ui";
import { FilterForm } from "@/components/admin/client";
import { MixChart } from "@/components/admin/charts";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { addCustomerAction } from "./actions";

const kh = (id: number) => `KH${String(id).padStart(6, "0")}`;
const segTone = (s: string) => (s === "repeat" || s === "bought" ? "green" : s === "dormant" ? "amber" : "gray") as "green" | "amber" | "gray";

export default async function CustomersPage({ searchParams }: PageProps<"/admin/customers">) {
  const sp = (await searchParams) as SP;
  const { rows, pg } = listCustomers(sp);
  const st = customerStats();
  const base = "/admin/customers";
  const viewId = Number(sp1(sp.view)) || rows[0]?.id;
  const sel = viewId ? getCustomer(viewId) : null;
  const closeHref = href(base, sp, { modal: null });
  const lastCohort = st.cohorts[st.cohorts.length - 1];
  const f = st.funnel;
  return (
    <>
      <PageHeader title="Khách hàng được giới thiệu" sub="Theo dõi khách hàng, trạng thái chuyển đổi và tái mua" />
      <div className="adm-grid adm-g4">
        {st.kpis.map((k) => (
          <div key={k.label} className="adm-card">
            <div style={{ color: "#475569", fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{k.unit === "pct" ? `${num(k.value, 1)}%` : num(k.value)}</div>
            {k.delta !== null ? <Delta v={k.delta} label="so với 30 ngày trước" /> : <div className="dl nu" style={{ fontSize: 13, color: "var(--muted)" }}>Tính trên toàn bộ dữ liệu</div>}
          </div>
        ))}
      </div>

      <FilterForm action={base}>
        <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm tên, SĐT, email, mã KH…" />
        <select className="adm-select" name="partner" defaultValue={sp1(sp.partner)}>
          <option value="">Tất cả đối tác</option><option value="none">Không qua đối tác</option>
          {st.partners.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
        </select>
        <select className="adm-select" name="source" defaultValue={sp1(sp.source)}><option value="">Tất cả nguồn</option>{st.sources.map((s) => <option key={s}>{s}</option>)}</select>
        <select className="adm-select" name="segment" defaultValue={sp1(sp.segment)}><option value="">Tất cả trạng thái</option>{["repeat", "bought", "potential", "dormant"].map((s) => <option key={s} value={s}>{SEGMENT_LABEL[s]}</option>)}</select>
        <select className="adm-select" name="buys" defaultValue={sp1(sp.buys)}><option value="">Lần mua: Tất cả</option><option value="0">Chưa mua</option><option value="1">1 lần</option><option value="2">Từ 2 lần</option></select>
        <Link className="adm-btn sm" href={base}>Xóa lọc</Link>
      </FilterForm>

      <div className="adm-grid adm-g-side">
        <Card flush title={`Danh sách khách hàng được giới thiệu (${num(pg.total)})`} action={<><DownloadLink className="adm-btn sm" to="/admin/export/customers"><Download size={14} /> Xuất Excel</DownloadLink><Link className="adm-btn sm p" href={href(base, sp, { modal: "new" })}><Plus size={14} /> Thêm ghi nhận</Link></>}>
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>Mã KH</th><th>Họ tên</th><th>Người giới thiệu</th><th>Nguồn</th><th>Ngày ghi nhận</th><th className="r">Tổng chi tiêu</th><th className="r">Số lần mua</th><th>Lần mua gần nhất</th><th>Trạng thái</th></tr></thead>
            <tbody>{rows.map((c) => (
              <tr key={c.id} style={c.id === sel?.c.id ? { background: "#f4fbf8" } : undefined}>
                <td><Link className="lnk" href={href(base, sp, { view: c.id })}>{kh(c.id)}</Link></td>
                <td><b>{c.name}</b><br /><span className="mut">{maskPhone(c.phone)}</span></td>
                <td>{c.partner_handle ? <Link href={`/admin/partners/${c.partner_code}`}>@{c.partner_handle}</Link> : <span className="mut">—</span>}</td>
                <td>{c.source ?? "—"}</td><td>{dateVN(c.created_at)}</td><td className="r">{vndAdmin(c.spent)}</td><td className="r">{c.orders}</td>
                <td>{dateVN(c.last_order) || "—"}</td><td><Badge tone={segTone(c.segment)}>{SEGMENT_LABEL[c.segment] ?? c.segment}</Badge></td>
              </tr>))}
              {!rows.length && <tr><td colSpan={9} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Không có khách hàng phù hợp.</td></tr>}
            </tbody></table></div>
          <Pagination pg={pg} base={base} sp={sp} noun="khách hàng" />
        </Card>

        <Card title="Chi tiết khách hàng">
          {sel ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{sel.c.name}</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "4px 0 12px" }}><span className="mut">{kh(sel.c.id)}</span><Badge tone={segTone(sel.c.segment)}>{SEGMENT_LABEL[sel.c.segment] ?? sel.c.segment}</Badge></div>
              <dl className="adm-kv" style={{ gridTemplateColumns: "110px 1fr" }}>
                <dt>SĐT</dt><dd>{maskPhone(sel.c.phone)}</dd><dt>Email</dt><dd style={{ wordBreak: "break-all" }}>{sel.c.email ?? "—"}</dd><dt>Thành phố</dt><dd>{sel.c.province ?? "—"}</dd>
                <dt>Người giới thiệu</dt><dd>{sel.c.partner_handle ? `@${sel.c.partner_handle}` : "—"}</dd><dt>Nguồn</dt><dd>{sel.c.source ?? "—"}</dd>
                <dt>Tổng chi tiêu</dt><dd>{vndAdmin(sel.c.spent)}</dd><dt>Số lần mua</dt><dd>{sel.c.orders}</dd>
              </dl>
              {sel.c.partner_code && (
                <div className="adm-note info" style={{ marginTop: 14, fontSize: 13 }}>
                  <b>Attribution: {sel.c.partner_code} — Đã khóa</b><br />Claim giới thiệu, quyết định nguồn (attribution) và người chăm sóc (care) là 3 đối tượng riêng. Click link đối tác khác không đổi chủ attribution đã khóa.
                </div>
              )}
              <h4 style={{ margin: "14px 0 6px" }}>Lịch sử mua hàng gần đây</h4>
              <div className="adm-list">
                {sel.orders.map((o) => (
                  <div key={o.code}><div style={{ flex: 1 }}><Link className="lnk" href={`/admin/orders?view=${o.code}`}>{dateVN(o.created_at)} – #{o.code}</Link><div className="mut" style={{ fontSize: 12.5 }}>{o.items} · {vndAdmin(o.total)}</div></div><StatusBadge sq status={o.status} label={ORDER_STATUS[o.status]} /></div>
                ))}
                {!sel.orders.length && <div style={{ color: "var(--muted)" }}>Chưa có đơn hàng.</div>}
              </div>
            </>
          ) : <p style={{ color: "var(--muted)" }}>Chọn một khách hàng để xem chi tiết.</p>}
        </Card>
      </div>

      <div className="adm-grid adm-g21">
        <Card title="Tỷ lệ tái mua theo cohort (theo tháng ghi nhận)">
          <MixChart xKey="m" height={260} rightSuffix="%" data={st.cohorts.map((c) => ({ m: c.m, first: c.first, repeat: c.repeat, rate: Math.round(c.rate * 10) / 10 }))}
            bars={[{ key: "first", name: "Số KH lần đầu", color: "#3b82f6" }, { key: "repeat", name: "Số KH tái mua", color: "#10b981" }]} lines={[{ key: "rate", name: "Tỷ lệ tái mua (%)", color: "#f59e0b", axis: "r" }]} />
        </Card>
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          {lastCohort && (
            <Card title={`Cohort ${lastCohort.m}`}>
              <dl className="adm-kv" style={{ gridTemplateColumns: "1fr auto" }}><dt>KH lần đầu</dt><dd>{num(lastCohort.first)}</dd><dt>KH tái mua</dt><dd>{num(lastCohort.repeat)}</dd><dt>Tỷ lệ</dt><dd>{num(lastCohort.rate, 1)}%</dd></dl>
            </Card>
          )}
          <Card title="Hành trình khách hàng (tổng quan)">
            {[["Click (ước tính)", f.clicks, null], ["Đăng ký", f.signups, f.clicks], ["Đơn đầu", f.first, f.signups], ["Tái mua", f.repeat, f.first]].map(([k, v, of]) => (
              <div key={k as string} style={{ display: "flex", gap: 8, padding: "7px 0", borderTop: "1px solid var(--line2)" }}><span style={{ flex: 1 }}>{k}</span><b>{num(v as number)}</b><span style={{ color: "var(--muted)", width: 56, textAlign: "right" }}>{of ? `→ ${num(((v as number) / (of as number)) * 100, 1)}%` : ""}</span></div>
            ))}
          </Card>
        </div>
      </div>

      {sp1(sp.modal) === "new" && (
        <Modal title="Thêm ghi nhận khách hàng" closeHref={closeHref}>
          <form action={addCustomerAction}>
            <input type="hidden" name="_back" value="/admin/customers" />
            <div className="adm-fgrid">
              <Field label="Họ và tên *"><input className="adm-input" name="name" required /></Field>
              <Field label="Số điện thoại *"><input className="adm-input" name="phone" required /></Field>
              <Field label="Email"><input className="adm-input" type="email" name="email" /></Field>
              <Field label="Tỉnh/TP"><input className="adm-input" name="province" defaultValue="Hà Nội" /></Field>
              <Field label="Người giới thiệu"><select className="adm-select" name="partner"><option value="">Không qua đối tác</option>{st.partners.map((p) => <option key={p.code} value={p.code}>{p.name} (@{p.handle})</option>)}</select></Field>
              <Field label="Nguồn"><select className="adm-select" name="source" defaultValue="Website">{["Website", "Facebook", "TikTok", "Zalo"].map((s) => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
