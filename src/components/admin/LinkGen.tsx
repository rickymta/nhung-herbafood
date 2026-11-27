"use client";
import { useMemo, useState } from "react";
import { Copy, Link2 } from "lucide-react";

type Opt = { value: string; label: string };
export default function LinkGen({ products, partners, campaigns }: { products: Opt[]; partners: Opt[]; campaigns: Opt[] }) {
  const [f, setF] = useState({ product: "", partner: partners[0]?.value ?? "", campaign: campaigns[0]?.value ?? "", source: "facebook", medium: "post", content: "" });
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const path = f.product ? `/products/${f.product}` : "/";
    const q = new URLSearchParams();
    if (f.partner) q.set("ref", f.partner);
    if (f.campaign) q.set("utm_campaign", f.campaign);
    q.set("utm_source", f.source);
    q.set("utm_medium", f.medium);
    if (f.content) q.set("utm_content", f.content);
    return `${origin}${path}?${q}`;
  }, [f]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div>
      <div className="adm-fgrid">
        <div><label className="adm-label">Đích đến</label><select className="adm-select" value={f.product} onChange={set("product")}><option value="">Trang chủ cửa hàng</option>{products.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="adm-label">Đối tác *</label><select className="adm-select" value={f.partner} onChange={set("partner")}>{partners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="adm-label">Chiến dịch (UTM)</label><select className="adm-select" value={f.campaign} onChange={set("campaign")}><option value="">—</option>{campaigns.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        <div><label className="adm-label">Nguồn truy cập</label><select className="adm-select" value={f.source} onChange={set("source")}>{["facebook", "tiktok", "zalo", "youtube", "website"].map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="adm-label">Medium</label><select className="adm-select" value={f.medium} onChange={set("medium")}>{["post", "video", "story", "ads", "livestream"].map((s) => <option key={s}>{s}</option>)}</select></div>
        <div><label className="adm-label">Content</label><input className="adm-input" value={f.content} onChange={set("content")} placeholder="banner, video1, review" /></div>
      </div>
      <div className="adm-label" style={{ marginTop: 16 }}><Link2 size={14} style={{ verticalAlign: -2 }} /> Liên kết Affiliate (đầy đủ tham số UTM)</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="adm-input" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
        <button type="button" className="adm-btn" onClick={() => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy size={15} /> {copied ? "Đã chép" : "Sao chép"}</button>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 0 }}>Khách truy cập link được gắn cookie <code>tn_ref</code> 30 ngày; đơn hàng sẽ tự gắn đối tác và tạo hoa hồng.</p>
    </div>
  );
}
