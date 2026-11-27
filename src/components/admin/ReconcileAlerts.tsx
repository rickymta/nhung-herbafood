import Link from "next/link";
import { Card } from "./ui";
import { vndAdmin } from "@/lib/format";

type R = { diff: { n: number; s: number }; notEligible: number; adj: { n: number; s: number } };
export function ReconcileAlerts({ r }: { r: R }) {
  return (
    <Card title="Cảnh báo đối soát" more={{ href: "/admin/orders?tab=errors", label: "Xem chi tiết" }}>
      <div className="adm-list">
        <div><div style={{ flex: 1 }}><b>{r.diff.n} đơn lỗi đồng bộ / chênh lệch doanh số</b><div style={{ color: "var(--muted)", fontSize: 13 }}>Tổng giá trị liên quan: {vndAdmin(r.diff.s)}</div></div></div>
        <div><div style={{ flex: 1 }}><b>{r.notEligible} đơn chưa đủ điều kiện</b><div style={{ color: "var(--muted)", fontSize: 13 }}>Đang giao / trong thời gian hoàn đổi</div></div></div>
        <div><div style={{ flex: 1 }}><b>{r.adj.n} giao dịch có điều chỉnh hoa hồng</b><div style={{ color: "var(--muted)", fontSize: 13 }}>Tổng điều chỉnh: {r.adj.s >= 0 ? "+" : ""}{vndAdmin(r.adj.s)}</div></div><Link className="adm-btn sm" href="/admin/commission">Xem</Link></div>
      </div>
    </Card>
  );
}
