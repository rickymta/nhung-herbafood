import Link from "next/link";
import { Check, Download, Pause, Pencil, X, Coins, Clock, Wallet, BadgeCheck } from "lucide-react";
import { commissionKpis, currentPeriod, listCommissions, reconcile } from "@/lib/admin/finance";
import { all } from "@/lib/db";
import { COMM_STATUS, type SP, sp1 } from "@/lib/admin/common";
import { Avatar, Card, Field, Kpi, Modal, Note, PageHeader, Pagination, StatusBadge, Tabs, href, DownloadLink } from "@/components/admin/ui";
import { FilterForm } from "@/components/admin/client";
import PaymentsView from "@/components/admin/PaymentsView";
import { ReconcileAlerts } from "@/components/admin/ReconcileAlerts";
import { vndAdmin, num } from "@/lib/format";
import { adjustAction, approveAllAction, commissionStatusAction } from "./actions";

export default async function CommissionPage({ searchParams }: PageProps<"/admin/commission">) {
  const sp = (await searchParams) as SP;
  const tab = sp1(sp.tab) || "list";
  const base = "/admin/commission";
  const here = href(base, sp);
  const k = commissionKpis();
  const icons = [Coins, Clock, Wallet, BadgeCheck];
  const camps = all<{ id: number; name: string }>("SELECT id,name FROM campaigns ORDER BY start_date DESC");
  const list = tab === "list" ? listCommissions(sp) : null;
  const rc = reconcile();
  const adjRow = list && sp1(sp.adjust) ? list.rows.find((r) => r.id === Number(sp1(sp.adjust))) : null;
  const closeHref = href(base, sp, { adjust: null });
  return (
    <>
      <PageHeader title="Hoa hồng, đối soát & thanh toán" sub="Tính toán, kiểm tra và chi trả hoa hồng cho đối tác">
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>Kỳ hiện tại: {currentPeriod()}</span>
      </PageHeader>
      <FilterForm action={base}>
        {tab !== "list" && <input type="hidden" name="tab" value={tab} />}
        <select className="adm-select" name="campaign" defaultValue={sp1(sp.campaign)}><option value="">Tất cả chiến dịch</option>{camps.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      </FilterForm>
      <div className="adm-grid adm-g4">{k.map((x, i) => { const I = icons[i]; return <Kpi key={x.label} label={x.label} kind="vnd" value={x.value} delta={x.delta} icon={<I size={18} />} deltaLabel="so với 30 ngày trước" />; })}</div>

      <Tabs base={base} sp={sp} active={tab} items={[{ key: "list", label: "Hoa hồng" }, { key: "reconcile", label: "Đối soát" }, { key: "payments", label: "Thanh toán" }]} />

      {list && (
        <Card flush title="Danh sách hoa hồng theo đơn" action={<><form action={approveAllAction}><input type="hidden" name="_back" value={here} /><button className="adm-btn sm p"><Check size={14} /> Duyệt tất cả (đơn hoàn thành)</button></form><DownloadLink className="adm-btn sm" to="/admin/export/commissions"><Download size={14} /> Xuất Excel</DownloadLink></>}>
          <FilterForm action={base}>
            <input type="hidden" name="tab" value="list" />
            <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm đối tác, mã đơn…" style={{ marginLeft: 18 }} />
            <select className="adm-select" name="status" defaultValue={sp1(sp.status)}><option value="">Tất cả trạng thái</option>{Object.entries(COMM_STATUS).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
            {sp1(sp.campaign) && <input type="hidden" name="campaign" value={sp1(sp.campaign)} />}
          </FilterForm>
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>#</th><th>Kỳ</th><th>Đối tác</th><th>Đơn</th><th className="r">Doanh số đủ ĐK</th><th className="r">Tỷ lệ</th><th className="r">Hoa hồng</th><th className="r">Điều chỉnh</th><th>Trạng thái</th><th>Người duyệt</th><th>Thao tác</th></tr></thead>
            <tbody>{list.rows.map((c, i) => (
              <tr key={c.id}>
                <td>{list.pg.offset + i + 1}</td><td>{list.monthLabel(c.created_at)}</td>
                <td><Link href={`/admin/partners/${c.partner_code}`} style={{ display: "flex", gap: 8, alignItems: "center" }}><Avatar name={c.partner_name} i={i} sm /><span><b>{c.partner_name}</b><br /><span className="mut">@{c.partner_handle}</span></span></Link></td>
                <td><Link className="lnk" href={`/admin/orders?view=${c.order_code}`}>{c.order_code}</Link></td>
                <td className="r">{vndAdmin(c.base_amount)}</td><td className="r">{num(c.rate, 1)}%</td><td className="r">{vndAdmin(c.amount)}</td>
                <td className="r" style={{ color: c.adjustment > 0 ? "#15803d" : c.adjustment < 0 ? "#b91c1c" : undefined }}>{c.adjustment > 0 ? "+" : ""}{vndAdmin(c.adjustment)}</td>
                <td><StatusBadge status={c.status} label={COMM_STATUS[c.status]} /></td><td>{c.approved_by ?? "–"}</td>
                <td>{c.status !== "paid" && (
                  <div style={{ display: "flex", gap: 5 }}>
                    {["approved", "held", "rejected"].map((s) => c.status !== s && (
                      <form key={s} action={commissionStatusAction}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="status" value={s} /><input type="hidden" name="_back" value={here} />
                        <button className="adm-ib" title={s === "approved" ? "Duyệt" : s === "held" ? "Tạm giữ" : "Từ chối"}>{s === "approved" ? <Check size={14} /> : s === "held" ? <Pause size={14} /> : <X size={14} />}</button></form>
                    ))}
                    <Link className="adm-ib" href={href(base, sp, { adjust: c.id })} title="Điều chỉnh"><Pencil size={14} /></Link>
                  </div>)}</td>
              </tr>))}
              {!list.rows.length && <tr><td colSpan={11} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Không có hoa hồng phù hợp.</td></tr>}
            </tbody></table></div>
          <Pagination pg={list.pg} base={base} sp={sp} noun="kết quả" />
          <p style={{ margin: 0, padding: "0 16px 14px", fontSize: 12.5, color: "var(--muted)" }}>Số tiền tính bằng số nguyên VND, làm tròn xuống. Đơn Hoàn thành → “Đã duyệt”; Hủy/Hoàn trả → “Từ chối”. Điều chỉnh thực hiện bằng bút toán ADJUSTMENT riêng.</p>
        </Card>
      )}

      {tab === "reconcile" && (
        <>
          <Card title={`Đối soát kỳ ${rc.period}`}>
            <div className="adm-grid adm-g3" style={{ marginBottom: 0 }}>
              {[["Tổng bút toán accrual", rc.accrual], ["Tổng đảo (reversal)", rc.reversal], ["Tổng đã chi (payout)", rc.paid]].map(([l, v]) => (
                <div key={l as string}><div style={{ color: "var(--muted)", fontWeight: 600 }}>{l}</div><div style={{ fontSize: 24, fontWeight: 800 }}>{vndAdmin(v as number)}</div></div>
              ))}
            </div>
            <Note tone="info"><span style={{ display: "block", marginTop: 12 }}>Số liệu ledger: {num(rc.entries)} bút toán. Đối soát với TN MALL (GMV, hoàn trả) dùng adapter mock.</span></Note>
          </Card>
          <div style={{ height: 16 }} />
          <ReconcileAlerts r={rc} />
        </>
      )}
      {tab === "payments" && <PaymentsView base={base} sp={sp} />}

      {adjRow && (
        <Modal title={`Điều chỉnh hoa hồng – ${adjRow.order_code}`} closeHref={closeHref}>
          <form action={adjustAction}>
            <input type="hidden" name="id" value={adjRow.id} /><input type="hidden" name="_back" value={closeHref} />
            <Field label="Số tiền điều chỉnh (₫, có thể âm)"><input className="adm-input" type="number" name="amount" defaultValue={adjRow.adjustment} step={1000} /></Field>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
