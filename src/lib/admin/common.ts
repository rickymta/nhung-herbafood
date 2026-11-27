import "server-only";

export type SP = Record<string, string | string[] | undefined>;
export const sp1 = (v: string | string[] | undefined): string => (Array.isArray(v) ? v[0] : v) ?? "";
export const spInt = (v: string | string[] | undefined, d = 1): number => {
  const n = parseInt(sp1(v), 10);
  return Number.isFinite(n) && n > 0 ? n : d;
};

export const TZ_OFFSET_H = 7;
/** local-day bucket expression for a UTC datetime column */
export const dayOf = (col: string) => `date(${col}, '+${TZ_OFFSET_H} hours')`;
export const VALID = "NOT IN ('cancelled','returned')";

export function fmtUtc(ms: number): string {
  return new Date(ms).toISOString().slice(0, 19).replace("T", " ");
}
export function localMidnightMs(daysAgo = 0): number {
  const now = Date.now() + TZ_OFFSET_H * 3600e3;
  const d = new Date(now);
  const mid = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - TZ_OFFSET_H * 3600e3;
  return mid - daysAgo * 86400e3;
}
export function ddmm(day: string): string {
  // YYYY-MM-DD -> dd/mm
  return `${day.slice(8, 10)}/${day.slice(5, 7)}`;
}
export function ddmmyyyy(ms: number): string {
  const d = new Date(ms + TZ_OFFSET_H * 3600e3);
  return `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`;
}

export type Range = { days: number; from: string; to: string; prevFrom: string; label: string; fromMs: number };
export function parseRange(v: string | string[] | undefined): Range {
  const n = parseInt(sp1(v), 10);
  const days = n === 7 || n === 90 ? n : 30;
  const fromMs = localMidnightMs(days - 1);
  const toMs = localMidnightMs(-1);
  return {
    days,
    fromMs,
    from: fmtUtc(fromMs),
    to: fmtUtc(toMs),
    prevFrom: fmtUtc(fromMs - days * 86400e3),
    label: `${days} ngày gần nhất`,
  };
}
export function rangeText(r: Range): string {
  return `${ddmmyyyy(r.fromMs)} – ${ddmmyyyy(Date.now())}`;
}

export function delta(cur: number, prev: number): number | null {
  if (!prev) return cur ? null : 0;
  return ((cur - prev) / prev) * 100;
}

export function paginate(page: number, per: number, total: number) {
  const pages = Math.max(1, Math.ceil(total / per));
  const p = Math.min(Math.max(1, page), pages);
  return { page: p, pages, offset: (p - 1) * per, offset0: (p - 1) * per, from: total ? (p - 1) * per + 1 : 0, to: Math.min(total, p * per), total };
}

/* ---------- labels ---------- */
export const TIER_LABEL: Record<string, string> = { bronze: "Bronze", silver: "Silver", gold: "Gold", sapphire: "Sapphire", diamond: "Sapphire" };
export const TYPE_LABEL: Record<string, string> = { affiliate: "Affiliate", ctv: "CTV", agency: "Đại lý" };
export const PARTNER_STATUS: Record<string, string> = { active: "Đang hoạt động", pending: "Chờ duyệt", suspended: "Tạm dừng" };
export const ORDER_STATUS: Record<string, string> = {
  pending: "Chờ xác nhận", confirmed: "Chờ lấy hàng", shipping: "Đang giao", completed: "Hoàn thành", cancelled: "Đã hủy", returned: "Hoàn trả",
};
export const PAY_STATUS: Record<string, string> = { paid: "Đã thanh toán", unpaid: "Chờ thanh toán", refunded: "Đã hoàn tiền" };
export const PAY_METHOD: Record<string, string> = { cod: "COD", bank: "Chuyển khoản", momo: "Ví MoMo" };
export const COMM_STATUS: Record<string, string> = { pending: "Chờ duyệt", approved: "Đã duyệt", held: "Tạm giữ", paid: "Đã thanh toán", rejected: "Từ chối" };
export const PAYOUT_STATUS: Record<string, string> = { pending: "Chờ chi", processing: "Đang xử lý", paid: "Đã thanh toán", failed: "Thất bại" };
export const SEGMENT_LABEL: Record<string, string> = { repeat: "Tái mua tốt", bought: "Đã mua", potential: "Tiềm năng", dormant: "Ngủ đông", new: "Tiềm năng" };
export const SOURCE_LABEL: Record<string, string> = { affiliate: "Đối tác Affiliate", website: "TN Stroke Guard (Direct)", campaign: "Chiến dịch đặc biệt", other: "Khác" };
export const REGIONS = ["Miền Bắc", "Miền Nam", "Miền Trung", "Tây Nguyên"];
export const SOURCES = ["TN MALL", "Facebook", "TikTok", "Website", "YouTube", "Zalo"];

export type Tone = "green" | "blue" | "orange" | "red" | "gray" | "purple" | "amber";
export const TONE: Record<string, Tone> = {
  active: "green", paid: "green", completed: "green", approved: "green", synced: "blue", success: "green", repeat: "green", bought: "green",
  shipping: "blue", confirmed: "orange", pending: "orange", unpaid: "orange", held: "amber", processing: "blue",
  suspended: "gray", potential: "gray", dormant: "amber", rejected: "red", cancelled: "red", returned: "red", error: "red", failed: "red", refunded: "gray",
};

export function campaignState(c: { status: string; start_date: string; end_date: string }, today = new Date()): "running" | "upcoming" | "ended" | "paused" {
  if (c.status === "paused" || c.status === "draft") return "paused";
  const t = fmtUtc(today.getTime() + TZ_OFFSET_H * 3600e3).slice(0, 10);
  if (t < c.start_date) return "upcoming";
  if (t > c.end_date) return "ended";
  return "running";
}
export const CAMP_STATE_LABEL = { running: "Đang chạy", upcoming: "Sắp diễn ra", ended: "Đã kết thúc", paused: "Tạm dừng" } as const;
export const CAMP_TYPE_LABEL: Record<string, string> = {
  commission_boost: "Thưởng hoa hồng", flash_sale: "Flash sale", combo: "Combo", channel: "Theo kênh",
};

export function maskPhone(p: string | null | undefined): string {
  if (!p) return "";
  return p.length > 6 ? `${p.slice(0, 4)}.•••.${p.slice(-3)}` : p;
}

export function safeBack(v: FormDataEntryValue | null, fallback: string): string {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/admin") ? s : fallback;
}
