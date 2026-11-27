import Link from "next/link";
import { Download, Eye, RefreshCw, Webhook, CheckCircle2 } from "lucide-react";
import { getOrder, listOrders, orderKpis } from "@/lib/admin/orders";
import { integrationInfo } from "@/lib/admin/misc";
import { COMM_STATUS, ORDER_STATUS, PAY_METHOD, PAY_STATUS, maskPhone, type SP, sp1 } from "@/lib/admin/common";
import { Badge, Card, Delta, Modal, PageHeader, Pagination, StatusBadge, Tabs, href, DownloadLink } from "@/components/admin/ui";
import { FilterForm } from "@/components/admin/client";
import { MixChart } from "@/components/admin/charts";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { orderStatusAction, resyncOrderAction, simulateWebhookAction } from "./actions";

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = (await searchParams) as SP;
  const tab = sp1(sp.tab) || "orders";
  const k = orderKpis();
  const base = "/admin/orders";
  const here = href(base, sp);
  const info = integrationInfo();
  const { rows, pg } = tab === "webhooks" ? { rows: [], pg: { page: 1, pages: 1, from: 0, to: 0, total: 0, offset: 0, offset0: 0 } } : listOrders(sp);
  const view = sp1(sp.view) ? getOrder(sp1(sp.view)) : null;
  const closeHref = href(base, sp, { view: null });
  const ok = k.errs === 0;
  return (
    <>
      <PageHeader title="Đơn hàng & đồng bộ TN MALL" sub="Theo dõi đơn hàng Affiliate, trạng thái xử lý và log đồng bộ dữ liệu">
        <DownloadLink className="adm-btn" to="/admin/export/orders"><Download size={16} /> Xuất Excel</DownloadLink>
        <form action={simulateWebhookAction}><input type="hidden" name="_back" value={here} /><button className="adm-btn"><Webhook size={16} /> Giả lập webhook TN MALL</button></form>
      </PageHeader>

      <div className="adm-grid adm-g4">
        {k.kpis.map((x, i) => (
          <div key={x.label} className="adm-card">
            <div style={{ color: "#475569", fontWeight: 600 }}>{x.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>{num(x.value)}</div>
            <Delta v={x.delta === null ? null : i === 3 ? x.delta : x.delta} label="so với 30 ngày trước" />
          </div>
        ))}
      </div>

      <div className={`adm-note ${ok ? "ok" : ""}`} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <CheckCircle2 size={18} />
        <span><b>Kết nối TN MALL:</b> {ok ? "Hoạt động bình thường" : `${k.errs} đơn lỗi đồng bộ cần xử lý`} · Đồng bộ cuối: {dateVN(k.lastSync, true)} · <Badge tone="green">MOCK</Badge></span>
      </div>

      <Tabs base={base} sp={sp} active={tab} items={[{ key: "orders", label: "Đơn hàng" }, { key: "errors", label: `Lỗi đồng bộ (${k.errs})` }, { key: "webhooks", label: "Nhật ký webhook" }]} />

      {tab !== "webhooks" && (
        <>
          <FilterForm action={base}>
            {tab !== "orders" && <input type="hidden" name="tab" value={tab} />}
            <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm mã đơn, khách, SĐT, mã đối tác…" />
            <select className="adm-select" name="status" defaultValue={sp1(sp.status)}><option value="">Tất cả trạng thái</option>{Object.entries(ORDER_STATUS).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
            <select className="adm-select" name="payment" defaultValue={sp1(sp.payment)}><option value="">Thanh toán</option>{Object.entries(PAY_STATUS).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
            <select className="adm-select" name="sync" defaultValue={sp1(sp.sync)}><option value="">Tất cả đồng bộ</option><option value="synced">Đã đồng bộ</option><option value="error">Lỗi đồng bộ</option></select>
            <select className="adm-select" name="partner" defaultValue={sp1(sp.partner)}><option value="">Mọi nguồn</option><option value="none">Không qua đối tác</option></select>
            <Link className="adm-btn sm" href={tab === "orders" ? base : href(base, {}, { tab })}>Xóa lọc</Link>
          </FilterForm>
          <Card flush>
            <div className="adm-tblwrap"><table className="adm-tbl">
              <thead><tr><th>#</th><th>Mã đơn</th><th>Khách hàng</th><th>Đối tác</th><th>Sản phẩm</th><th className="r">Giá trị đơn</th><th>TT thanh toán</th><th>TT giao hàng</th><th>Đủ ĐK hoa hồng</th><th>Thời gian đặt</th><th>TT đồng bộ</th><th /></tr></thead>
              <tbody>{rows.map((o, i) => (
                <tr key={o.id}>
                  <td>{pg.offset + i + 1}</td>
                  <td><Link className="lnk" href={href(base, sp, { view: o.code })}>{o.code}</Link></td>
                  <td>{o.customer_name}<br /><span className="mut">{maskPhone(o.customer_phone)}</span></td>
                  <td>{o.partner_code ? <Link className="lnk" href={`/admin/partners/${o.partner_code}`}>{o.partner_code}</Link> : <span className="mut">—</span>}</td>
                  <td style={{ maxWidth: 230, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.items ?? ""}>{o.items ?? "—"}</td>
                  <td className="r">{vndAdmin(o.total)}</td>
                  <td><StatusBadge sq status={o.payment_status} label={PAY_STATUS[o.payment_status] ?? o.payment_status} /></td>
                  <td><StatusBadge sq status={o.status} label={ORDER_STATUS[o.status]} /></td>
                  <td>{!o.partner_id ? <span className="mut">—</span> : o.comm_status === "rejected" ? <span className="dn" style={{ fontWeight: 600 }}>Không</span> : o.status === "completed" ? <span className="up" style={{ fontWeight: 600 }}>Đủ ĐK</span> : <span style={{ color: "#c2410c", fontWeight: 600 }}>Chờ</span>}</td>
                  <td>{dateVN(o.created_at, true)}</td>
                  <td>{o.sync_status === "error" ? <Badge sq tone="red">Lỗi đồng bộ</Badge> : <Badge sq tone="blue">Đã đồng bộ</Badge>}</td>
                  <td><Link className="adm-ib" href={href(base, sp, { view: o.code })} title="Xem / đổi trạng thái"><Eye size={15} /></Link></td>
                </tr>))}
                {!rows.length && <tr><td colSpan={12} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Không có đơn hàng phù hợp.</td></tr>}
              </tbody></table></div>
            <Pagination pg={pg} base={base} sp={sp} noun="đơn hàng" />
          </Card>
        </>
      )}

      {tab === "webhooks" && (
        <Card flush title="Nhật ký webhook">
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Thời gian</th><th>Sự kiện</th><th>Nội dung</th><th>Trạng thái</th></tr></thead>
            <tbody>{info.logs.map((l) => <tr key={l.id}><td>{dateVN(l.created_at, true)}</td><td><code>{l.event}</code></td><td>{l.message}</td><td><StatusBadge sq status={l.status} label={l.status === "success" ? "Thành công" : "Lỗi"} /></td></tr>)}</tbody></table></div>
        </Card>
      )}

      <div className="adm-grid adm-g21" style={{ marginTop: 16 }}>
        <Card title="Đơn hàng theo ngày (30 ngày gần nhất)">
          <MixChart xKey="label" height={240} data={k.daily.map((d) => ({ label: d.label, orders: d.orders }))} bars={[{ key: "orders", name: "Đơn hợp lệ", color: "#3b82f6" }]} />
        </Card>
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <Card title="Tổng quan đồng bộ">
            <div style={{ fontSize: 30, fontWeight: 800 }}>{num(k.syncRate, 1)}%</div><div className="mut" style={{ color: "var(--muted)", marginBottom: 8 }}>Tỷ lệ đồng bộ thành công</div>
            <dl className="adm-kv" style={{ gridTemplateColumns: "1fr auto" }}><dt>Đồng bộ thành công</dt><dd>{num(k.total - k.errs)} đơn</dd><dt>Lỗi đồng bộ</dt><dd>{num(k.errs)} đơn</dd></dl>
          </Card>
          <Card title="Nhật ký đồng bộ" more={{ href: href(base, {}, { tab: "webhooks" }), label: "Xem tất cả" }}>
            <div className="adm-list">{info.logs.slice(0, 4).map((l) => <div key={l.id}><div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{l.event}</div><div className="mut" style={{ fontSize: 12.5, color: "var(--muted)" }}>{dateVN(l.created_at, true)} · {l.message}</div></div><StatusBadge sq status={l.status} label={l.status === "success" ? "Thành công" : "Lỗi"} /></div>)}</div>
          </Card>
        </div>
      </div>

      {view && (
        <Modal title={`Đơn ${view.o.code}`} closeHref={closeHref} wide>
          <dl className="adm-kv">
            <dt>Khách hàng</dt><dd>{String(view.o.customer_name)} · {String(view.o.customer_phone)}</dd>
            <dt>Địa chỉ</dt><dd>{String(view.o.shipping_address ?? "—")}</dd>
            <dt>Đối tác</dt><dd>{view.o.partner_code ? `${view.o.partner_code} – ${view.o.partner_name}` : "Không qua đối tác"}</dd>
            {view.camp && <><dt>Chiến dịch</dt><dd>{view.camp.name}</dd></>}
            <dt>Thanh toán</dt><dd>{PAY_METHOD[String(view.o.payment_method)] ?? String(view.o.payment_method)} · {PAY_STATUS[String(view.o.payment_status)] ?? String(view.o.payment_status)}</dd>
            <dt>Thời gian đặt</dt><dd>{dateVN(String(view.o.created_at), true)}</dd>
            <dt>Bút toán hoa hồng</dt><dd>{view.comm ? `${vndAdmin(view.comm.amount)} (${view.comm.rate}%) – ${COMM_STATUS[view.comm.status]}` : "Không có (đơn không qua đối tác)"}</dd>
          </dl>
          <table className="adm-tbl" style={{ marginTop: 14 }}>
            <thead><tr><th>Sản phẩm</th><th className="r">Đơn giá</th><th className="r">SL</th><th className="r">Thành tiền</th></tr></thead>
            <tbody>{view.items.map((it, i) => <tr key={i}><td>{it.name}</td><td className="r">{vndAdmin(it.price)}</td><td className="r">{it.quantity}</td><td className="r">{vndAdmin(it.price * it.quantity)}</td></tr>)}
              <tr><td colSpan={3} className="r mut">Giảm giá</td><td className="r">-{vndAdmin(Number(view.o.discount))}</td></tr>
              <tr><td colSpan={3} className="r mut">Phí vận chuyển</td><td className="r">{vndAdmin(Number(view.o.shipping_fee))}</td></tr>
              <tr><td colSpan={3} className="r"><b>Tổng cộng</b></td><td className="r"><b>{vndAdmin(Number(view.o.total))}</b></td></tr></tbody>
          </table>
          <form action={orderStatusAction} style={{ marginTop: 18, display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
            <input type="hidden" name="id" value={String(view.o.id)} /><input type="hidden" name="_back" value={closeHref} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="adm-label">Trạng thái đơn hàng</label>
              <select className="adm-select" name="status" defaultValue={String(view.o.status)}>{Object.entries(ORDER_STATUS).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
            </div>
            <button className="adm-btn p">Cập nhật trạng thái</button>
          </form>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 0 }}>Hoàn thành → hoa hồng “Đã duyệt”; Hủy/Hoàn trả → hoa hồng “Từ chối”.</p>
          {view.o.sync_status === "error" && (
            <form action={resyncOrderAction} style={{ marginTop: 10 }}><input type="hidden" name="id" value={String(view.o.id)} /><input type="hidden" name="_back" value={closeHref} /><button className="adm-btn"><RefreshCw size={15} /> Đồng bộ lại</button></form>
          )}
          <div className="mf"><Link className="adm-btn" href={closeHref}>Đóng</Link></div>
        </Modal>
      )}
    </>
  );
}
