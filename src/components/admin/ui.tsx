import Link from "next/link";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { initials, num, vndAdmin } from "@/lib/format";
import { TONE, type Tone } from "@/lib/admin/common";

export function PageHeader({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="adm-ph">
      <div>
        <h1 className="adm-h1">{title}</h1>
        {sub && <p className="adm-sub">{sub}</p>}
      </div>
      {children && <div className="adm-acts">{children}</div>}
    </div>
  );
}

export function Card({ title, more, children, flush, className = "", action }: { title?: ReactNode; more?: { href: string; label: string }; children: ReactNode; flush?: boolean; className?: string; action?: ReactNode }) {
  return (
    <section className={`adm-card ${flush ? "flush" : ""} ${className}`}>
      {(title || more || action) && (
        <div className="adm-ch">
          <h3>{title}</h3>
          <div className="adm-acts">
            {action}
            {more && <Link className="more" href={more.href}>{more.label}</Link>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

export function Badge({ tone, children, sq }: { tone?: Tone; children: ReactNode; sq?: boolean }) {
  return <span className={`adm-pill t-${tone ?? "gray"} ${sq ? "sq" : ""}`}>{children}</span>;
}
export const StatusBadge = ({ status, label, sq }: { status: string; label: string; sq?: boolean }) => (
  <Badge tone={TONE[status] ?? "gray"} sq={sq}>{label}</Badge>
);

const TIER_TONE: Record<string, Tone> = { bronze: "orange", silver: "gray", gold: "amber", sapphire: "blue", diamond: "blue" };
export const TierBadge = ({ tier }: { tier: string }) => (
  <Badge tone={TIER_TONE[tier] ?? "gray"}>{tier === "diamond" ? "Sapphire" : tier.charAt(0).toUpperCase() + tier.slice(1)}</Badge>
);

export function Avatar({ name, i = 0, sm }: { name: string; i?: number; sm?: boolean }) {
  return <span className={`adm-av ${sm ? "sm" : ""} ${["", "c1", "c2", "c3", "c4"][i % 5]}`}>{initials(name)}</span>;
}

export function Delta({ v, pts, label = "so với kỳ trước" }: { v: number | null; pts?: boolean; label?: string }) {
  if (v === null) return <div className="dl nu">— <small>{label}</small></div>;
  const up = v >= 0;
  return (
    <div className={`dl ${up ? "up" : "dn"}`}>
      {up ? "▲ +" : "▼ -"}{num(Math.abs(v), 1)}{pts ? " điểm %" : "%"}
      <small>{label}</small>
    </div>
  );
}

function Spark({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="pad" />;
  const w = 200, h = 34;
  const max = Math.max(...data, 1), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 3 - ((v - min) / (max - min || 1)) * (h - 8)]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const id = `sp${Math.abs(data.reduce((a, b) => a + b, 0)) % 9973}${data.length}`;
  return (
    <svg className="sp" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981" stopOpacity=".35" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke="#10b981" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Kpi({ label, value, kind = "num", delta, deltaPts, icon, spark, sub, deltaLabel }: {
  label: string; value: number | string; kind?: "vnd" | "num" | "pct" | "raw"; delta?: number | null; deltaPts?: boolean; icon?: ReactNode; spark?: number[]; sub?: string; deltaLabel?: string;
}) {
  const text = kind === "vnd" ? vndAdmin(value as number) : kind === "pct" ? `${num(value as number, 1)}%` : kind === "num" ? num(value as number) : String(value);
  return (
    <div className="adm-card adm-kpi" title="Số liệu tính từ SQLite theo thời gian thực">
      <div className="lb">
        {icon && <span className="ic">{icon}</span>}
        {label}
      </div>
      <div className={`v ${text.length > 14 ? "long" : ""}`}>{text}</div>
      {delta !== undefined ? <Delta v={delta} pts={deltaPts} label={deltaLabel} /> : sub ? <div className="dl nu"><small style={{ marginLeft: 0 }}>{sub}</small></div> : null}
      {spark ? <Spark data={spark} /> : <div className="pad" />}
    </div>
  );
}

export function href(base: string, sp: Record<string, string | string[] | undefined>, patch: Record<string, string | number | null | undefined> = {}) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const s = Array.isArray(v) ? v[0] : v;
    if (s) q.set(k, s);
  }
  for (const [k, v] of Object.entries(patch)) {
    if (v === null || v === undefined || v === "") q.delete(k);
    else q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `${base}?${s}` : base;
}

export function Pagination({ pg, base, sp, noun }: { pg: { page: number; pages: number; from: number; to: number; total: number }; base: string; sp: Record<string, string | string[] | undefined>; noun: string }) {
  const nums: (number | "…")[] = [];
  const add = (n: number) => !nums.includes(n) && nums.push(n);
  add(1);
  if (pg.page > 3) nums.push("…");
  for (let n = Math.max(2, pg.page - 1); n <= Math.min(pg.pages - 1, pg.page + 1); n++) add(n);
  if (pg.page < pg.pages - 2) nums.push("…");
  if (pg.pages > 1) add(pg.pages);
  return (
    <div className="adm-pager">
      <span>Hiển thị {pg.from} – {pg.to} trên {num(pg.total)} {noun}</span>
      <div className="pg">
        {nums.map((n, i) =>
          n === "…" ? <span key={`e${i}`} style={{ border: 0 }}>…</span> : (
            <Link key={n} href={href(base, sp, { page: n === 1 ? null : n })} className={n === pg.page ? "on" : ""}>{n}</Link>
          ),
        )}
      </div>
    </div>
  );
}

export function Tabs({ items, active, base, sp, param = "tab" }: { items: { key: string; label: string }[]; active: string; base: string; sp: Record<string, string | string[] | undefined>; param?: string }) {
  return (
    <div className="adm-tabs">
      {items.map((t) => (
        <Link key={t.key} href={href(base, sp, { [param]: t.key === items[0].key ? null : t.key, page: null })} className={t.key === active ? "on" : ""}>{t.label}</Link>
      ))}
    </div>
  );
}

/** Server-rendered modal: close = navigate to closeHref. */
export function Modal({ title, closeHref, children, wide }: { title: string; closeHref: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={`adm-modal ${wide ? "wide" : ""}`}>
      <Link href={closeHref} className="bg" aria-label="Đóng" />
      <div className="box" role="dialog" aria-label={title}>
        <div className="mh">
          <h2>{title}</h2>
          <Link href={closeHref} className="adm-ib" aria-label="Đóng"><X size={16} /></Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={full ? "full" : ""}>
      <label className="adm-label">{label}</label>
      {children}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--muted)" }}>{children}</div>;
}

export function Note({ children, tone }: { children: ReactNode; tone?: "ok" | "info" }) {
  return <div className={`adm-note ${tone ?? ""}`}>{children}</div>;
}

export function SortTh({ base, sp, k, children, cur, dir, className }: { base: string; sp: Record<string, string | string[] | undefined>; k: string; children: ReactNode; cur: string; dir: string; className?: string }) {
  const nextDir = cur === k && dir === "desc" ? "asc" : "desc";
  return (
    <th className={className}>
      <Link href={href(base, sp, { sort: k, dir: nextDir, page: null })}>{children} {cur === k ? (dir === "desc" ? "↓" : "↑") : "⇅"}</Link>
    </th>
  );
}

/** File download (CSV) – plain anchor on purpose. */
export function DownloadLink({ to, children, className = "adm-btn" }: { to: string; children: ReactNode; className?: string }) {
  return <a className={className} href={to}>{children}</a>;
}

export function Thumb({ src, size = 40 }: { src: string | null; size?: number }) {
  const st = { width: size, height: size, objectFit: "contain" as const, borderRadius: 8, background: "#f1f5f9", flex: "none" as const };
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" width={size} height={size} style={st} /> : <span style={st} />;
}
