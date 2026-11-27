"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bell, ChevronDown, CreditCard, Database, FileText, GraduationCap, House, Layers, Link2, LogOut, Megaphone, Package, Search,
  Settings, ShoppingCart, UserRound, Users, ChartNoAxesColumn, HeartPulse, X,
} from "lucide-react";
import { initials } from "@/lib/format";

type Alert = { key: string; title: string; desc: string; href: string; count: number; tone: string };
type User = { name: string; email: string; role: string };

const ROLE: Record<string, string> = { owner: "CEO", admin: "Quản trị viên", accountant: "Kế toán", partner_ops: "Vận hành đối tác", policy: "Quản lý chính sách" };

const NAV = [
  { href: "/admin", label: "Tổng quan", icon: House, exact: true },
  {
    href: "/admin/partners", label: "Đối tác", icon: Users,
    sub: [
      { href: "/admin/partners", label: "Danh sách đối tác", match: (p: string, q: string) => !q.includes("status=pending") },
      { href: "/admin/partners?status=pending", label: "Hồ sơ đăng ký", match: (_p: string, q: string) => q.includes("status=pending") },
      { href: "/admin/settings?tab=tiers", label: "Cấp bậc & chính sách", match: () => false },
    ],
  },
  { href: "/admin/customers", label: "Khách hàng", icon: UserRound },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/admin/commission", label: "Hoa hồng & Đối soát", icon: Database },
  { href: "/admin/payments", label: "Thanh toán", icon: CreditCard },
  { href: "/admin/campaigns", label: "Chiến dịch", icon: Megaphone },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/content", label: "Nội dung", icon: FileText },
  { href: "/admin/assessments", label: "Đánh giá nguy cơ", icon: HeartPulse },
  { href: "/admin/reports", label: "Báo cáo", icon: ChartNoAxesColumn },
  { href: "/admin/training", label: "Đào tạo", icon: GraduationCap },
  { href: "/admin/integration", label: "Tích hợp TN MALL", icon: Link2 },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
];

export default function Shell({ user, alerts, logout, children }: { user: User; alerts: Alert[]; logout: () => Promise<void>; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [menu, setMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const alertCount = alerts.reduce((s, a) => s + a.count, 0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (e.key === "Escape") {
        setBell(false);
        setMenu(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const search = useSearchParams().toString();
  const isOn = (n: (typeof NAV)[number]) => (n.exact ? path === n.href : path.startsWith(n.href));

  return (
    <div className="adm-shell">
      <div className={`adm-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`adm-side ${open ? "open" : ""}`}>
        <div className="adm-logo">
          <i>T<b>N</b></i>
          TN AFFILIATE OS
        </div>
        <nav className="adm-nav">
          {NAV.map((n) => {
            const on = isOn(n);
            const Icon = n.icon;
            return (
              <div key={n.href}>
                <Link href={n.href} className={`it ${on ? "on" : ""}`} onClick={() => setOpen(false)}>
                  <Icon size={20} strokeWidth={1.8} />
                  {n.label}
                </Link>
                {"sub" in n && n.sub && on && (
                  <div className="sub">
                    {n.sub.map((s) => (
                      <Link key={s.href} href={s.href} className={s.match(path, search) ? "on" : ""} onClick={() => setOpen(false)}>{s.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="adm-foot">
          Phiên bản S1 · Dữ liệu SQLite
          <br />
          TN STROKE GUARD · TN MALL
        </div>
      </aside>

      <div className="adm-main-wrap">
        <header className="adm-top">
          <button type="button" className="adm-burger" onClick={() => setOpen(true)} aria-label="Mở menu"><Layers size={20} /></button>
          <form
            className="adm-search"
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) router.push(`/admin/search?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            <Search size={18} />
            <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm đối tác, khách hàng, đơn hàng, chiến dịch..." />
            <span className="adm-kbd">Ctrl + K</span>
          </form>
          <div className="adm-spacer" />
          <span className="adm-pill-live" title="Toàn bộ số liệu được tính trực tiếp từ cơ sở dữ liệu SQLite">SQLITE · LIVE</span>
          <button type="button" className="adm-bell" onClick={() => setBell(true)} aria-label="Thông báo">
            <Bell size={19} />
            {alertCount > 0 && <em>{alertCount > 99 ? "99+" : alertCount}</em>}
          </button>
          <span className="adm-vsep" />
          <div style={{ position: "relative" }} ref={menuRef}>
            <button type="button" className="adm-who" onClick={() => setMenu((v) => !v)}>
              <span className="adm-av">{initials(user.name)}</span>
              <span className="nm" style={{ fontWeight: 600 }}>{user.name}</span>
              <ChevronDown size={16} />
            </button>
            {menu && (
              <div className="adm-menu">
                <div className="hd">TÀI KHOẢN</div>
                <div style={{ padding: "4px 10px 10px", fontSize: 13 }}>
                  <div style={{ fontWeight: 700 }}>{user.name}</div>
                  <div style={{ color: "var(--muted)" }}>{user.email} · {ROLE[user.role] ?? user.role}</div>
                </div>
                <Link href="/admin/settings" onClick={() => setMenu(false)}><Settings size={16} /> Cài đặt & nhật ký kiểm toán</Link>
                <form action={logout}>
                  <button type="submit" className="mi" style={{ color: "#b91c1c" }}><LogOut size={16} /> Đăng xuất</button>
                </form>
              </div>
            )}
          </div>
        </header>
        <main className="adm-main">{children}</main>
      </div>

      {bell && (
        <div className="adm-modal">
          <div className="bg" onClick={() => setBell(false)} />
          <div className="box">
            <div className="mh">
              <h2>Thông báo</h2>
              <button type="button" className="adm-ib" onClick={() => setBell(false)} aria-label="Đóng"><X size={16} /></button>
            </div>
            {alerts.length === 0 ? (
              <p style={{ color: "var(--muted)" }}>Không có cảnh báo nào cần xử lý.</p>
            ) : (
              <div className="adm-list">
                {alerts.map((a) => (
                  <div key={a.key}>
                    <span className={`adm-dot`} style={{ background: a.tone === "red" ? "#ef4444" : a.tone === "orange" ? "#f97316" : a.tone === "amber" ? "#f59e0b" : "#3b82f6" }} />
                    <Link href={a.href} onClick={() => setBell(false)} style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>{a.desc}</div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mf"><button type="button" className="adm-btn" onClick={() => setBell(false)}>Đóng</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
