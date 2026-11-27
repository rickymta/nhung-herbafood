import Link from "next/link";
import { Download, Plus, Check, X } from "lucide-react";
import { batchDetail, currentPeriod, listBatches, nextPayoutDate, payoutPreview } from "@/lib/admin/finance";
import { Badge, Card, Modal, Note, StatusBadge, href, DownloadLink } from "@/components/admin/ui";
import { ConfirmButton } from "@/components/admin/client";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { cancelBatchAction, createBatchAction, payBatchAction } from "@/app/admin/(panel)/commission/actions";
import { sp1, type SP } from "@/lib/admin/common";

export default function PaymentsView({ base, sp }: { base: string; sp: SP }) {
  const prev = payoutPreview();
  const batches = listBatches();
  const here = href(base, sp);
  const closeHref = href(base, sp, { modal: null, batch: null });
  const detail = sp1(sp.batch) ? batchDetail(sp1(sp.batch)) : null;
  const lastPending = batches.find((b) => b.status !== "paid");
  return (
    <>
      <div className="adm-grid adm-g21">
        <Card flush title="Lịch sử thanh toán" action={<DownloadLink className="adm-btn sm" to="/admin/export/payouts"><Download size={14} /> Xuất bảng kê</DownloadLink>}>
          <div className="adm-tblwrap"><table className="adm-tbl">
            <thead><tr><th>#</th><th>Mã đợt chi trả</th><th>Kỳ đối soát</th><th>Ngày tạo</th><th>Ngày thanh toán</th><th className="r">Số đối tác</th><th className="r">Tổng chi trả</th><th>Trạng thái</th><th>Người thực hiện</th><th /></tr></thead>
            <tbody>{batches.map((b, i) => (
              <tr key={b.batch}>
                <td>{i + 1}</td><td><Link className="lnk" href={href(base, sp, { batch: b.batch })}>{b.batch}</Link></td><td>{b.period}</td><td>{dateVN(b.created_at)}</td><td>{dateVN(b.paid_at) || "—"}</td>
                <td className="r">{b.partners}</td><td className="r">{vndAdmin(b.total)}</td>
                <td><StatusBadge status={b.status} label={b.status === "paid" ? "Đã thanh toán" : "Chờ chi"} /></td>
                <td style={{ fontSize: 12.5 }}>Lập: {b.created_by ?? "—"}<br />Duyệt: {b.approved_by ?? "–"}</td>
                <td>
                  {b.status !== "paid" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <form action={payBatchAction}><input type="hidden" name="batch" value={b.batch} /><input type="hidden" name="_back" value={here} /><ConfirmButton className="adm-btn sm p" message={`Đánh dấu ${b.batch} đã chi? Hoa hồng liên quan sẽ chuyển sang “Đã thanh toán”.`}><Check size={14} /> Đã chi</ConfirmButton></form>
                      <form action={cancelBatchAction}><input type="hidden" name="batch" value={b.batch} /><input type="hidden" name="_back" value={here} /><ConfirmButton className="adm-btn sm d" message={`Hủy đợt chi ${b.batch}?`}><X size={14} /></ConfirmButton></form>
                    </div>
                  )}
                </td>
              </tr>))}
              {!batches.length && <tr><td colSpan={10} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Chưa có đợt chi nào.</td></tr>}
            </tbody></table></div>
        </Card>
        <Card title="Tổng quan chi trả kỳ này">
          <dl className="adm-kv" style={{ gridTemplateColumns: "1fr auto" }}>
            <dt>Tổng chi trả (Chuyển khoản)</dt><dd>{vndAdmin(prev.total)}</dd>
            <dt>Thuế TNCN tạm khấu trừ</dt><dd>{vndAdmin(prev.tax)}</dd>
            <dt>Số đối tác chi trả</dt><dd>{prev.count} đối tác</dd>
            <dt>Ngày chi trả dự kiến</dt><dd>{dateVN(nextPayoutDate())}</dd>
            <dt>Kỳ đối soát</dt><dd>{currentPeriod()}</dd>
          </dl>
          <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
            <Link className="adm-btn p" href={href(base, sp, { modal: "payout" })}><Plus size={16} /> Tạo đợt thanh toán</Link>
            <DownloadLink className="adm-btn" to="/admin/export/payouts"><Download size={16} /> Xuất bảng kê</DownloadLink>
            {lastPending && (
              <form action={cancelBatchAction}><input type="hidden" name="batch" value={lastPending.batch} /><input type="hidden" name="_back" value={here} /><ConfirmButton className="adm-btn d" message={`Từ chối đợt ${lastPending.batch}?`}>Từ chối {lastPending.batch}</ConfirmButton></form>
            )}
          </div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 0 }}>Chỉ gom hoa hồng “Đã duyệt” của đối tác đạt ngưỡng tối thiểu {vndAdmin(prev.min)}. Ngân hàng: mô phỏng.</p>
        </Card>
      </div>

      {sp1(sp.modal) === "payout" && (
        <Modal title="Tạo đợt thanh toán" closeHref={closeHref} wide>
          {prev.count ? (
            <>
              <p>Lập đợt chi cho <b>{prev.count} đối tác</b> đã duyệt, tổng <b>{vndAdmin(prev.total)}</b> (thuế tạm khấu trừ {vndAdmin(prev.tax)}).</p>
              <div className="adm-tblwrap" style={{ maxHeight: 280, overflow: "auto" }}><table className="adm-tbl"><thead><tr><th>Đối tác</th><th className="r">Số bút toán</th><th className="r">Số tiền</th></tr></thead>
                <tbody>{prev.rows.map((r) => <tr key={r.code}><td>{r.code} – {r.name}</td><td className="r">{r.n}</td><td className="r">{vndAdmin(r.sum)}</td></tr>)}</tbody></table></div>
              <form action={createBatchAction}><input type="hidden" name="_back" value={base} />
                <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Tạo đợt chi</button></div></form>
            </>
          ) : (
            <><Note>Chưa có hoa hồng “Đã duyệt” đủ ngưỡng {vndAdmin(prev.min)} để lập đợt chi. Hãy duyệt hoa hồng ở tab “Hoa hồng” hoặc hoàn thành đơn hàng trước.</Note><div className="mf"><Link className="adm-btn" href={closeHref}>Đóng</Link></div></>
          )}
        </Modal>
      )}
      {detail && (
        <Modal title={`Đợt chi ${sp1(sp.batch)}`} closeHref={closeHref} wide>
          <div className="adm-tblwrap" style={{ maxHeight: 360, overflow: "auto" }}><table className="adm-tbl"><thead><tr><th>Đối tác</th><th>Ngân hàng</th><th className="r">Gộp</th><th className="r">Thuế</th><th className="r">Thực nhận</th><th>Trạng thái</th></tr></thead>
            <tbody>{detail.map((r) => <tr key={r.id}><td>{r.partner_code} – {r.partner_name}</td><td>{r.bank_name} {r.bank_account ? `•••${r.bank_account.slice(-4)}` : ""}</td><td className="r">{vndAdmin(r.amount)}</td><td className="r">{vndAdmin(r.tax)}</td><td className="r">{vndAdmin(r.amount - r.tax)}</td><td><Badge tone={r.status === "paid" ? "green" : "orange"} sq>{r.status === "paid" ? "Đã chi" : "Chờ chi"}</Badge></td></tr>)}</tbody></table></div>
          <p style={{ color: "var(--muted)" }}>{num(detail.length)} đối tác</p>
          <div className="mf"><Link className="adm-btn" href={closeHref}>Đóng</Link></div>
        </Modal>
      )}
    </>
  );
}
