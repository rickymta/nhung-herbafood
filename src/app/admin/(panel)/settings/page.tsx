import { Check, Minus } from "lucide-react";
import { adminUsers, allSettings, recentLogs } from "@/lib/admin/misc";
import { parseJson } from "@/lib/db";
import { Avatar, Badge, Card, Field, PageHeader, Tabs } from "@/components/admin/ui";
import { dateVN, vndAdmin } from "@/lib/format";
import { type SP, sp1 } from "@/lib/admin/common";
import { changePasswordAction, savePolicyAction, saveTiersAction } from "./actions";

const ROLES = [["owner", "CEO"], ["accountant", "Kế toán"], ["partner_ops", "Vận hành đối tác"], ["policy", "Quản lý chính sách"], ["partner", "Đối tác (cổng đối tác)"]];
const PERMS: [string, string, string[]][] = [
  ["Xem tổng quan điều hành", "dashboard.view", ["owner", "accountant", "partner_ops", "policy"]],
  ["Xem đối tác", "partner.view", ["owner", "accountant", "partner_ops", "policy"]],
  ["Sửa/khóa đối tác", "partner.edit", ["owner", "partner_ops"]],
  ["Xác minh hồ sơ", "application.review", ["owner", "partner_ops"]],
  ["Phê duyệt hồ sơ", "application.approve", ["owner"]],
  ["Xem chính sách", "policy.view", ["owner", "accountant", "partner_ops", "policy"]],
  ["Soạn bản nháp chính sách", "policy.draft", ["owner", "policy"]],
  ["Kích hoạt chính sách", "policy.publish", ["owner"]],
  ["Quản lý chiến dịch", "campaign.manage", ["owner", "policy"]],
  ["Tạo liên kết cho đối tác", "link.create", ["owner", "partner_ops"]],
  ["Xem khách hàng", "customer.view", ["owner", "partner_ops", "accountant"]],
  ["Xem đơn hàng", "order.view", ["owner", "partner_ops", "accountant"]],
  ["Quản lý tích hợp TN MALL", "integration.manage", ["owner"]],
  ["Xem hoa hồng", "commission.view", ["owner", "accountant", "partner_ops"]],
  ["Lập đợt chi (maker)", "payout.create", ["accountant"]],
  ["Duyệt đợt chi (checker)", "payout.approve", ["owner"]],
  ["Xuất bảng kê", "payout.export", ["owner", "accountant"]],
  ["Xem nhật ký kiểm toán", "audit.view", ["owner"]],
  ["Xem số liệu của chính mình", "self.dashboard", ["partner"]],
  ["Tạo link của chính mình", "self.link.create", ["partner"]],
  ["Xem hoa hồng của chính mình", "self.commission.view", ["partner"]],
];
const TABS = [{ key: "general", label: "Chính sách chương trình" }, { key: "tiers", label: "Cấp bậc" }, { key: "team", label: "Tài khoản & phân quyền" }, { key: "audit", label: "Nhật ký kiểm toán" }, { key: "security", label: "Bảo mật" }];

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  const sp = (await searchParams) as SP;
  const tab = sp1(sp.tab) || "general";
  const base = "/admin/settings";
  const s = allSettings();
  const tiers = parseJson<{ key: string; name: string; min_gmv: number; rate: number }[]>(s.tiers, []);
  return (
    <>
      <PageHeader title="Cài đặt" sub="Chính sách chương trình, cấp bậc, phân quyền, nhật ký kiểm toán và bảo mật" />
      <Tabs items={TABS} active={tab} base={base} sp={sp} />

      {tab === "general" && (
        <Card title="Chính sách chương trình Affiliate">
          <form action={savePolicyAction}>
            <div className="adm-fgrid">
              <Field label="Phiên bản chính sách"><input className="adm-input" name="policy_version" defaultValue={s.policy_version} /></Field>
              <Field label="Thời hạn cookie giới thiệu (ngày)"><input className="adm-input" type="number" name="cookie_days" defaultValue={s.cookie_days} /></Field>
              <Field label="Thời gian hoàn/đổi trước khi đủ điều kiện (ngày)"><input className="adm-input" type="number" name="return_window_days" defaultValue={s.return_window_days} /></Field>
              <Field label="Ngưỡng chi trả tối thiểu (₫)"><input className="adm-input" type="number" name="min_payout" step={50000} defaultValue={s.min_payout} /></Field>
              <Field label="Tỷ lệ hoa hồng mặc định (%)"><input className="adm-input" type="number" step={0.5} name="default_commission_rate" defaultValue={s.default_commission_rate} /></Field>
              <Field label="Ngày chi trả hằng tháng"><input className="adm-input" type="number" name="payout_day" defaultValue={s.payout_day} /></Field>
              <Field label="Thuế TNCN khấu trừ (%)"><input className="adm-input" type="number" step={0.5} name="tax_rate" defaultValue={s.tax_rate} /></Field>
              <Field label="Áp dụng khấu trừ từ (₫/đợt)"><input className="adm-input" type="number" step={100000} name="tax_threshold" defaultValue={s.tax_threshold} /></Field>
            </div>
            <div className="mf"><button className="adm-btn p">Lưu chính sách</button></div>
          </form>
        </Card>
      )}

      {tab === "tiers" && (
        <Card title="Cấp bậc & tỷ lệ hoa hồng">
          <form action={saveTiersAction}>
            <table className="adm-tbl"><thead><tr><th>Cấp bậc</th><th>GMV tối thiểu (₫)</th><th>Tỷ lệ hoa hồng (%)</th></tr></thead>
              <tbody>{tiers.map((t) => (
                <tr key={t.key}><td><b>{t.name}</b></td>
                  <td><input className="adm-input" type="number" name={`${t.key}_min`} step={1000000} defaultValue={t.min_gmv} /></td>
                  <td><input className="adm-input" type="number" step={0.5} name={`${t.key}_rate`} defaultValue={t.rate} /></td></tr>))}</tbody></table>
            <label style={{ display: "flex", gap: 8, marginTop: 14 }}><input type="checkbox" name="apply" /> Áp dụng ngay tỷ lệ này cho tất cả đối tác thuộc từng cấp</label>
            <div className="mf"><button className="adm-btn p">Lưu cấp bậc</button></div>
          </form>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Ngưỡng hiện tại: {tiers.map((t) => `${t.name} ≥ ${vndAdmin(t.min_gmv)}`).join(" · ")}</p>
        </Card>
      )}

      {tab === "team" && (
        <>
          <Card flush title="Tài khoản quản trị">
            <table className="adm-tbl"><thead><tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Tạo lúc</th></tr></thead>
              <tbody>{adminUsers().map((u, i) => (
                <tr key={u.id}><td><div style={{ display: "flex", gap: 10, alignItems: "center" }}><Avatar name={u.name} i={i} sm /><b>{u.name}</b></div></td><td>{u.email}</td><td><Badge tone="blue">{ROLES.find((r) => r[0] === u.role)?.[1] ?? u.role}</Badge></td><td>{dateVN(u.created_at)}</td></tr>))}</tbody></table>
          </Card>
          <div style={{ height: 16 }} />
          <Card flush title="Ma trận phân quyền (RBAC)" action={<span style={{ color: "var(--muted)", fontSize: 13 }}>Kiểm tra tại lớp dịch vụ · Đối tác chỉ xem phạm vi của chính mình</span>}>
            <div className="adm-tblwrap"><table className="adm-tbl">
              <thead><tr><th>Quyền</th>{ROLES.map((r) => <th key={r[0]} style={{ textAlign: "center" }}>{r[1]}</th>)}</tr></thead>
              <tbody>{PERMS.map(([l, c, who]) => (
                <tr key={c}><td>{l} <code style={{ color: "var(--muted)" }}>{c}</code></td>
                  {ROLES.map((r) => <td key={r[0]} style={{ textAlign: "center" }}>{who.includes(r[0]) ? <Check size={16} color="#0f9d74" /> : <Minus size={14} color="#cbd5e1" />}</td>)}</tr>))}</tbody></table></div>
          </Card>
        </>
      )}

      {tab === "audit" && (
        <Card flush title="Nhật ký kiểm toán (audit trail)" action={<span style={{ color: "var(--muted)", fontSize: 13 }}>Chỉ thêm, không sửa</span>}>
          <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Thời gian</th><th>Người thực hiện</th><th>Hành động</th><th>Chi tiết</th></tr></thead>
            <tbody>{recentLogs(60).map((l) => <tr key={l.id}><td>{dateVN(l.created_at, true)}</td><td>{l.actor}</td><td><code>{l.action}</code></td><td>{l.target}</td></tr>)}</tbody></table></div>
        </Card>
      )}

      {tab === "security" && (
        <Card title="Đổi mật khẩu">
          <form action={changePasswordAction} style={{ maxWidth: 420, display: "grid", gap: 14 }}>
            <Field label="Mật khẩu hiện tại"><input className="adm-input" type="password" name="current" required autoComplete="current-password" /></Field>
            <Field label="Mật khẩu mới (≥ 8 ký tự)"><input className="adm-input" type="password" name="next" required minLength={8} autoComplete="new-password" /></Field>
            <Field label="Nhập lại mật khẩu mới"><input className="adm-input" type="password" name="again" required minLength={8} autoComplete="new-password" /></Field>
            <div><button className="adm-btn p">Đổi mật khẩu</button></div>
          </form>
        </Card>
      )}
    </>
  );
}
