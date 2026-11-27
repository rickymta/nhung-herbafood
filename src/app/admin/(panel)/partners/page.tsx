import Link from "next/link";
import { Download, Eye, Pause, Pencil, Play, Plus, Check } from "lucide-react";
import { listPartners, partnerStats, getPartner } from "@/lib/admin/partners";
import { PARTNER_STATUS, REGIONS, SOURCES, TIER_LABEL, TYPE_LABEL, type SP, sp1 } from "@/lib/admin/common";
import { Card, Delta, Field, Modal, PageHeader, Pagination, SortTh, StatusBadge, TierBadge, href, DownloadLink } from "@/components/admin/ui";
import { FilterForm } from "@/components/admin/client";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { bulkApproveAction, createPartnerAction, partnerStatusAction, updatePartnerAction } from "./actions";

export default async function PartnersPage({ searchParams }: PageProps<"/admin/partners">) {
  const sp = (await searchParams) as SP;
  const { rows, pg, sortKey, dir } = listPartners(sp);
  const st = partnerStats();
  const base = "/admin/partners";
  const here = href(base, sp);
  const edit = sp1(sp.edit) ? getPartner(sp1(sp.edit)) : null;
  const pending = st.kpis[2].value;
  const suspended = st.kpis[3].value;
  const maxR = Math.max(...st.regions.map((r) => r.n), 1);
  const closeHref = href(base, sp, { modal: null, edit: null });

  return (
    <>
      <PageHeader title="Quản lý đối tác Affiliate" sub="Danh sách đối tác, trạng thái hoạt động và hiệu suất bán hàng">
        <DownloadLink className="adm-btn" to="/admin/export/partners"><Download size={16} /> Xuất Excel</DownloadLink>
        <Link className="adm-btn p" href={href(base, sp, { modal: "new" })}><Plus size={16} /> Thêm đối tác</Link>
      </PageHeader>

      <div className="adm-grid adm-g4">
        {st.kpis.map((k) => (
          <div key={k.label} className="adm-card">
            <div style={{ color: "#475569", fontWeight: 600 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{num(k.value)}</div>
            <Delta v={k.delta} label="so với 30 ngày trước" />
          </div>
        ))}
      </div>

      <FilterForm action={base}>
        <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm tên, mã, email, @handle…" />
        <select className="adm-select" name="tier" defaultValue={sp1(sp.tier)}>
          <option value="">Cấp bậc</option>
          {["bronze", "silver", "gold", "sapphire"].map((t) => <option key={t} value={t}>{TIER_LABEL[t]}</option>)}
        </select>
        <select className="adm-select" name="status" defaultValue={sp1(sp.status)}>
          <option value="">Trạng thái</option>
          {Object.entries(PARTNER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="adm-select" name="type" defaultValue={sp1(sp.type)}>
          <option value="">Loại</option>
          {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="adm-select" name="source" defaultValue={sp1(sp.source)}>
          <option value="">Nguồn</option>
          {SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="adm-select" name="region" defaultValue={sp1(sp.region)}>
          <option value="">Khu vực</option>
          {REGIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <Link className="adm-btn sm" href={base}>Xóa lọc</Link>
      </FilterForm>

      <Card flush>
        <div className="adm-tblwrap">
          <table className="adm-tbl">
            <thead>
              <tr>
                <th>#</th><th>Mã đối tác</th><th>Họ và tên</th><th>Loại</th><th>Cấp bậc</th><th>Nguồn</th>
                <SortTh base={base} sp={sp} k="gmv" cur={sortKey} dir={dir} className="r">Doanh số</SortTh>
                <SortTh base={base} sp={sp} k="commission" cur={sortKey} dir={dir} className="r">Hoa hồng</SortTh>
                <SortTh base={base} sp={sp} k="orders" cur={sortKey} dir={dir} className="r">Đơn hàng</SortTh>
                <SortTh base={base} sp={sp} k="joined" cur={sortKey} dir={dir}>Ngày đăng ký</SortTh>
                <SortTh base={base} sp={sp} k="status" cur={sortKey} dir={dir}>Trạng thái</SortTh>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id}>
                  <td>{pg.offset0 + i + 1}</td>
                  <td><Link className="lnk" href={`/admin/partners/${p.code}`}>{p.code}</Link></td>
                  <td><b>{p.name}</b><br /><span className="mut">{p.email}</span></td>
                  <td>{TYPE_LABEL[p.type] ?? p.type}</td>
                  <td><TierBadge tier={p.tier} /></td>
                  <td>{p.channel}</td>
                  <td className="r">{vndAdmin(p.gmv)}</td>
                  <td className="r">{vndAdmin(p.commission)}</td>
                  <td className="r">{num(p.orders)}</td>
                  <td>{dateVN(p.joined_at)}</td>
                  <td>{p.status === "active" ? <StatusBadge status="active" label={PARTNER_STATUS.active} /> : <span style={{ fontWeight: 600, color: p.status === "pending" ? "#c2410c" : "#475569" }}>{PARTNER_STATUS[p.status]}</span>}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Link className="adm-ib" href={`/admin/partners/${p.code}`} title="Xem"><Eye size={15} /></Link>
                      <Link className="adm-ib" href={href(base, sp, { edit: p.code })} title="Sửa"><Pencil size={15} /></Link>
                      <form action={partnerStatusAction}>
                        <input type="hidden" name="code" value={p.code} /><input type="hidden" name="_back" value={here} />
                        <input type="hidden" name="status" value={p.status === "active" ? "suspended" : "active"} />
                        <button className="adm-ib" title={p.status === "pending" ? "Duyệt" : p.status === "active" ? "Tạm dừng" : "Kích hoạt lại"}>
                          {p.status === "pending" ? <Check size={15} /> : p.status === "active" ? <Pause size={15} /> : <Play size={15} />}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td colSpan={12} style={{ textAlign: "center", color: "var(--muted)", padding: 28 }}>Không có đối tác phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination pg={pg} base={base} sp={sp} noun="đối tác" />
      </Card>

      <div className="adm-grid adm-g3" style={{ marginTop: 16 }}>
        <Card title="Top nguồn kênh mang lại đối tác cao nhất">
          <table className="adm-tbl"><thead><tr><th>#</th><th>Nguồn</th><th className="r">Số đối tác</th><th className="r">Tỷ lệ</th></tr></thead>
            <tbody>{st.sources.map((s, i) => <tr key={s.k}><td>{i + 1}</td><td>{s.k}</td><td className="r">{s.n}</td><td className="r">{num((s.n / st.total) * 100, 1)}%</td></tr>)}</tbody></table>
        </Card>
        <Card title="Phân bổ đối tác theo khu vực">
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>{st.total} <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>Đối tác</span></div>
          {st.regions.map((r) => (
            <div key={r.k} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5 }}><span>{r.k}</span><b>{r.n}</b></div>
              <div className="adm-prog"><i style={{ width: `${(r.n / maxR) * 100}%` }} /></div>
            </div>
          ))}
        </Card>
        <Card title="Tác vụ nhanh">
          <div className="adm-list">
            <div><Link href={href(base, {}, { status: "pending" })} style={{ flex: 1, fontWeight: 600 }}>Duyệt đối tác chờ xử lý ({pending})</Link></div>
            <div><Link href={href(base, {}, { status: "suspended" })} style={{ flex: 1, fontWeight: 600 }}>Quản lý đối tác tạm dừng ({suspended})</Link></div>
            <div><Link href="/admin/settings?tab=tiers" style={{ flex: 1, fontWeight: 600 }}>Phân cấp / nâng cấp đối tác</Link></div>
            <div><Link href={href(base, sp, { modal: "new" })} style={{ flex: 1, fontWeight: 600 }}>Mời đối tác mới</Link></div>
            {pending > 0 && <div><form action={bulkApproveAction}><input type="hidden" name="_back" value={here} /><button className="adm-btn sm p">Duyệt tất cả {pending} hồ sơ</button></form></div>}
          </div>
        </Card>
      </div>

      {sp1(sp.modal) === "new" && (
        <Modal title="Thêm đối tác" closeHref={closeHref}>
          <div className="adm-note info" style={{ fontSize: 13 }}>Đối tác mới ở trạng thái Chờ duyệt, cấp Bronze.</div>
          <form action={createPartnerAction}>
            <input type="hidden" name="_back" value="/admin/partners" />
            <div className="adm-fgrid">
              <Field label="Họ và tên *" full><input className="adm-input" name="name" required /></Field>
              <Field label="Email *" full><input className="adm-input" type="email" name="email" required /></Field>
              <Field label="Loại"><select className="adm-select" name="type"><option value="affiliate">Affiliate</option><option value="ctv">CTV</option><option value="agency">Đại lý</option></select></Field>
              <Field label="Nguồn"><select className="adm-select" name="source" defaultValue="Website">{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Khu vực"><select className="adm-select" name="region">{REGIONS.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Tỉnh/TP"><input className="adm-input" name="province" defaultValue="Hà Nội" /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Tạo đối tác</button></div>
          </form>
        </Modal>
      )}
      {edit && (
        <Modal title={`Sửa hồ sơ ${edit.code}`} closeHref={closeHref}>
          <form action={updatePartnerAction}>
            <input type="hidden" name="code" value={edit.code} /><input type="hidden" name="_back" value={closeHref} />
            <div className="adm-fgrid">
              <Field label="Họ và tên" full><input className="adm-input" name="name" defaultValue={edit.name} required /></Field>
              <Field label="Email"><input className="adm-input" name="email" defaultValue={edit.email ?? ""} /></Field>
              <Field label="Số điện thoại"><input className="adm-input" name="phone" defaultValue={edit.phone ?? ""} /></Field>
              <Field label="Cấp bậc"><select className="adm-select" name="tier" defaultValue={edit.tier === "diamond" ? "sapphire" : edit.tier}>{["bronze", "silver", "gold", "sapphire"].map((t) => <option key={t} value={t}>{TIER_LABEL[t]}</option>)}</select></Field>
              <Field label="Tỷ lệ hoa hồng (%)"><input className="adm-input" name="rate" type="number" step="0.5" min="0" max="50" defaultValue={edit.commission_rate} /></Field>
              <Field label="Loại"><select className="adm-select" name="type" defaultValue={edit.type}><option value="affiliate">Affiliate</option><option value="ctv">CTV</option><option value="agency">Đại lý</option></select></Field>
              <Field label="Nguồn"><select className="adm-select" name="source" defaultValue={edit.channel ?? "Website"}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Khu vực"><select className="adm-select" name="region" defaultValue={edit.region ?? "Miền Bắc"}>{REGIONS.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Tỉnh/TP"><input className="adm-input" name="province" defaultValue={edit.province ?? ""} /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu thay đổi</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
