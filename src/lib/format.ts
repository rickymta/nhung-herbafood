/** 849000 -> "849.000đ" (storefront style) */
export function vnd(n: number | null | undefined): string {
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(n ?? 0))}đ`;
}

/** 12850000000 -> "12.850.000.000 ₫" (admin style) */
export function vndAdmin(n: number | null | undefined): string {
  return `${new Intl.NumberFormat("vi-VN").format(Math.round(n ?? 0))} ₫`;
}

export function num(n: number | null | undefined, digits = 0): string {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n ?? 0);
}

export function pct(n: number, digits = 1): string {
  return `${num(n, digits)}%`;
}

export function discountPercent(price: number, original?: number | null): number {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

/** SQLite "YYYY-MM-DD HH:MM:SS" (UTC) -> "dd/mm/yyyy" */
export function dateVN(s: string | null | undefined, withTime = false): string {
  if (!s) return "";
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T") + "Z");
  const pad = (x: number) => String(x).padStart(2, "0");
  const base = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  return withTime ? `${base} ${pad(d.getHours())}:${pad(d.getMinutes())}` : base;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function genCode(prefix: string): string {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `${prefix}${t}${r}`;
}
