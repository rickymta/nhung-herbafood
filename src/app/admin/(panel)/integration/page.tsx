import { RefreshCw, Webhook } from "lucide-react";
import { allSettings, integrationInfo } from "@/lib/admin/misc";
import { Badge, Card, Field, Kpi, Note, PageHeader, StatusBadge } from "@/components/admin/ui";
import { dateVN, num } from "@/lib/format";
import { simulateWebhookAction } from "../orders/actions";
import { saveIntegrationAction, syncNowAction } from "./actions";

const ENDPOINTS = [
  ["POST", "/webhooks/tnmall", "Nhận order.created / order.completed / order.refunded (ký HMAC, idempotent theo event.id)"],
  ["GET", "/integrations/tnmall/orders?since=", "Đồng bộ bù (pull) khi webhook lỗi"],
  ["GET", "/integrations/tnmall/products", "Projection danh mục sản phẩm"],
  ["POST", "/payouts/{id}/send", "Gửi lệnh chi qua bank adapter (sandbox)"],
];

export default function IntegrationPage() {
  const s = allSettings();
  const info = integrationInfo();
  const mock = s.tnmall_mode !== "live";
  return (
    <>
      <PageHeader title="Tích hợp TN MALL" sub="Adapter đơn hàng, hoàn trả và danh mục sản phẩm">
        <form action={syncNowAction}><button className="adm-btn"><RefreshCw size={15} /> Đồng bộ ngay</button></form>
        <form action={simulateWebhookAction}><input type="hidden" name="_back" value="/admin/integration" /><button className="adm-btn"><Webhook size={15} /> Mở trình giả lập webhook</button></form>
      </PageHeader>
      {mock && <Note><b>Trạng thái: MOCK.</b> Chưa có API TN MALL thật. Cần TN MALL cung cấp: tài liệu API, môi trường sandbox, cơ chế ký webhook (HMAC secret), danh sách trạng thái đơn và quy tắc hoàn trả.</Note>}
      <div className="adm-grid adm-g3">
        <Kpi label="Webhook inbox" value={info.events} sub="sự kiện đã xử lý" />
        <Kpi label="Đơn hàng (projection)" value={info.orders} sub="đơn trong cơ sở dữ liệu" />
        <Kpi label="Sản phẩm (projection)" value={info.products} sub="SKU trong cơ sở dữ liệu" />
      </div>

      <div className="adm-grid adm-g2">
        <Card title="Cấu hình kết nối">
          <form action={saveIntegrationAction}>
            <div className="adm-fgrid">
              <Field label="Chế độ"><select className="adm-select" name="mode" defaultValue={s.tnmall_mode ?? "mock"}><option value="mock">Mock (giả lập)</option><option value="live">Live</option></select></Field>
              <Field label="Tự động đồng bộ"><label style={{ display: "flex", gap: 8, alignItems: "center", height: 40 }}><input type="checkbox" name="auto_sync" defaultChecked={s.tnmall_auto_sync === "1"} /> Bật (mỗi 15 phút)</label></Field>
              <Field label="Base URL API" full><input className="adm-input" name="base_url" defaultValue={s.tnmall_base_url ?? ""} /></Field>
              <Field label="API key"><input className="adm-input" name="api_key" defaultValue={s.tnmall_api_key ?? ""} autoComplete="off" /></Field>
              <Field label="Webhook secret (HMAC)"><input className="adm-input" name="secret" defaultValue={s.tnmall_webhook_secret ?? ""} autoComplete="off" /></Field>
            </div>
            <div className="mf"><button className="adm-btn p">Lưu cấu hình</button></div>
          </form>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: 0 }}>Đồng bộ cuối: {dateVN(s.tnmall_last_sync, true)}. Khóa đã lưu được che; để nguyên để giữ giá trị cũ.</p>
        </Card>
        <Card flush title="Endpoint dự kiến (hợp đồng API — bản nháp)">
          <table className="adm-tbl"><thead><tr><th>Phương thức</th><th>Đường dẫn</th><th>Mô tả</th></tr></thead>
            <tbody>{ENDPOINTS.map(([m, p, d]) => <tr key={p}><td><Badge tone="blue" sq>{m}</Badge></td><td><code>{p}</code></td><td>{d}</td></tr>)}</tbody></table>
        </Card>
      </div>

      <Card flush title="Nhật ký webhook (mock)">
        <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Thời gian</th><th>Sự kiện</th><th>Nội dung</th><th>Trạng thái</th></tr></thead>
          <tbody>{info.logs.map((l) => <tr key={l.id}><td>{dateVN(l.created_at, true)}</td><td><code>{l.event}</code></td><td>{l.message}</td><td><StatusBadge sq status={l.status} label={l.status === "success" ? "Thành công" : "Lỗi"} /></td></tr>)}</tbody></table></div>
        <div className="adm-pager"><span>{num(info.logs.length)} sự kiện gần nhất</span></div>
      </Card>
    </>
  );
}
