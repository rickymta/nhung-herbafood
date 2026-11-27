import Link from "next/link";
import { Plus, Power } from "lucide-react";
import { listCampaigns } from "@/lib/admin/campaigns";
import { all } from "@/lib/db";
import { CAMP_STATE_LABEL, CAMP_TYPE_LABEL, type SP, sp1 } from "@/lib/admin/common";
import { Badge, Card, Field, Kpi, Modal, PageHeader, href } from "@/components/admin/ui";
import LinkGen from "@/components/admin/LinkGen";
import { Megaphone, Activity, Coins, Gift } from "lucide-react";
import { dateVN, num, vndAdmin } from "@/lib/format";
import { createCampaignAction, toggleCampaignAction } from "./actions";

const TONE = { running: "green", upcoming: "blue", ended: "gray", paused: "amber" } as const;

export default async function CampaignsPage({ searchParams }: PageProps<"/admin/campaigns">) {
  const sp = (await searchParams) as SP;
  const rows = listCampaigns();
  const base = "/admin/campaigns";
  const closeHref = href(base, sp, { modal: null });
  const products = all<{ slug: string; name: string }>("SELECT slug,name FROM products WHERE status='active' ORDER BY sort,id");
  const partners = all<{ code: string; name: string; handle: string }>("SELECT code,name,handle FROM partners WHERE status='active' ORDER BY name");
  const running = rows.filter((r) => r.state === "running");
  const filter = sp1(sp.state);
  const shown = filter ? rows.filter((r) => r.state === filter) : rows;
  return (
    <>
      <PageHeader title="Chiến dịch Affiliate" sub="Quản lý chiến dịch, thưởng hoa hồng thêm và tạo liên kết giới thiệu có UTM">
        <Link className="adm-btn p" href={href(base, sp, { modal: "new" })}><Plus size={16} /> Tạo chiến dịch</Link>
      </PageHeader>
      <div className="adm-grid adm-g4">
        <Kpi label="Tổng chiến dịch" value={rows.length} icon={<Megaphone size={18} />} sub="Tất cả trạng thái" />
        <Kpi label="Đang chạy" value={running.length} icon={<Activity size={18} />} sub={running.map((r) => r.name).join(", ") || "Không có"} />
        <Kpi label="GMV từ chiến dịch" kind="vnd" value={rows.reduce((s, r) => s + r.gmv, 0)} icon={<Coins size={18} />} sub="Đơn hợp lệ gắn chiến dịch" />
        <Kpi label="Hoa hồng phát sinh" kind="vnd" value={rows.reduce((s, r) => s + r.commission, 0)} icon={<Gift size={18} />} sub="Gồm thưởng thêm của chiến dịch" />
      </div>

      <div className="adm-filters">
        {[["", "Tất cả"], ["running", "Đang chạy"], ["upcoming", "Sắp diễn ra"], ["ended", "Đã kết thúc"], ["paused", "Tạm dừng"]].map(([k, l]) => (
          <Link key={k} href={href(base, sp, { state: k || null })} className={`adm-chip ${filter === k ? "on" : ""}`}>{l}</Link>
        ))}
      </div>

      <Card flush title={`Danh sách chiến dịch (${shown.length})`}>
        <div className="adm-tblwrap"><table className="adm-tbl">
          <thead><tr><th>Chiến dịch</th><th>Loại</th><th>Thời gian</th><th className="r">Thưởng thêm</th><th className="r">Mục tiêu GMV</th><th className="r">GMV thực tế</th><th style={{ minWidth: 130 }}>Tiến độ</th><th className="r">Đơn</th><th>Trạng thái</th><th /></tr></thead>
          <tbody>{shown.map((c) => {
            const pctv = c.budget ? Math.min(100, (c.gmv / c.budget) * 100) : 0;
            return (
              <tr key={c.id}>
                <td><b>{c.name}</b><br /><span className="mut">{c.code} · utm: {c.utm_code}</span></td>
                <td>{CAMP_TYPE_LABEL[c.type] ?? c.type}</td>
                <td>{dateVN(c.start_date + " 00:00:00")} – {dateVN(c.end_date + " 00:00:00")}</td>
                <td className="r">+{num(c.bonus_rate, 1)}%</td><td className="r">{vndAdmin(c.budget)}</td><td className="r">{vndAdmin(c.gmv)}</td>
                <td><div className="adm-prog"><i style={{ width: `${pctv}%` }} /></div><span className="mut">{num(pctv, 1)}%</span></td>
                <td className="r">{num(c.orders)}</td>
                <td><Badge tone={TONE[c.state]}>{CAMP_STATE_LABEL[c.state]}</Badge></td>
                <td>{c.state !== "ended" && (
                  <form action={toggleCampaignAction}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="_back" value={href(base, sp)} />
                    <button className="adm-btn sm" title="Bật/tắt chiến dịch"><Power size={13} /> {c.status === "active" ? "Tạm dừng" : "Kích hoạt"}</button></form>)}</td>
              </tr>
            );
          })}
            {!shown.length && <tr><td colSpan={10} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Không có chiến dịch.</td></tr>}</tbody></table></div>
      </Card>

      <div style={{ height: 16 }} />
      <Card title="Tạo liên kết giới thiệu" action={<span style={{ color: "var(--muted)", fontSize: 13 }}>Sinh link Affiliate kèm tham số UTM</span>}>
        <LinkGen
          products={products.map((p) => ({ value: p.slug, label: p.name }))}
          partners={partners.map((p) => ({ value: p.code, label: `${p.name} (@${p.handle})` }))}
          campaigns={rows.filter((r) => r.state !== "ended").map((r) => ({ value: r.utm_code ?? r.code, label: r.name }))}
        />
      </Card>

      {sp1(sp.modal) === "new" && (
        <Modal title="Tạo chiến dịch" closeHref={closeHref}>
          <form action={createCampaignAction}>
            <div className="adm-fgrid">
              <Field label="Tên chiến dịch *" full><input className="adm-input" name="name" required /></Field>
              <Field label="Bắt đầu *"><input className="adm-input" type="date" name="start" required /></Field>
              <Field label="Kết thúc *"><input className="adm-input" type="date" name="end" required /></Field>
              <Field label="Mục tiêu GMV (VND)"><input className="adm-input" type="number" name="budget" min={0} step={1000000} defaultValue={500000000} /></Field>
              <Field label="Thưởng hoa hồng thêm (%)"><input className="adm-input" type="number" name="bonus" min={0} max={20} step={0.5} defaultValue={2} /></Field>
              <Field label="Loại"><select className="adm-select" name="type">{Object.entries(CAMP_TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
              <Field label="Mã UTM campaign *"><input className="adm-input" name="utm" required placeholder="vd: sale_thang_2" /></Field>
              <Field label="Mô tả" full><textarea className="adm-textarea" name="description" /></Field>
            </div>
            <div className="mf"><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Tạo</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}
