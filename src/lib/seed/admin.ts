import type { DatabaseSync } from "node:sqlite";
import { hashPassword } from "../auth-hash";

/**
 * Affiliate/admin seed: partners, customers, campaigns, orders (+items), commissions,
 * payout batches, trainings, activity logs, settings. Deterministic (seeded PRNG).
 * "Today" is anchored to 2026-11-27 (local UTC+7).
 */

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Vũ", "Đặng", "Bùi", "Đỗ", "Ngô", "Dương", "Lý", "Phan", "Võ", "Trương"];
const DEM = ["Văn", "Thị", "Minh", "Quang", "Thu", "Ngọc", "Gia", "Đức", "Hoài", "Thanh", "Anh", "Hữu", "Kim", "Bảo", "Xuân"];
const TEN = ["Anh", "Bảo", "Chi", "Dũng", "Giang", "Hà", "Hải", "Hạnh", "Hiếu", "Hoa", "Hùng", "Huy", "Khánh", "Lan", "Linh", "Long", "Mai", "My", "Nam", "Nga", "Ngọc", "Nhi", "Phúc", "Phương", "Quân", "Quyên", "Sơn", "Thảo", "Trang", "Tuấn", "Vy", "Yến"];

const PROVINCES: [string, string][] = [
  ["Hà Nội", "Miền Bắc"], ["TP. Hồ Chí Minh", "Miền Nam"], ["Đà Nẵng", "Miền Trung"], ["Hải Phòng", "Miền Bắc"],
  ["Cần Thơ", "Miền Nam"], ["Bình Dương", "Miền Nam"], ["Đồng Nai", "Miền Nam"], ["Nghệ An", "Miền Trung"],
  ["Thanh Hóa", "Miền Bắc"], ["Khánh Hòa", "Miền Trung"], ["Thừa Thiên Huế", "Miền Trung"], ["Lâm Đồng", "Tây Nguyên"],
  ["Đắk Lắk", "Tây Nguyên"], ["Quảng Ninh", "Miền Bắc"],
];
const PROV_W = [24, 26, 7, 6, 5, 6, 5, 4, 4, 3, 3, 3, 2, 2];

const NAMED: { name: string; handle: string; type: string; tier: string; source: string; status: string; code?: string }[] = [
  { name: "Nguyễn Thị Mai Anh", handle: "maianh_aff", type: "affiliate", tier: "sapphire", source: "TN MALL", status: "active", code: "AFF001286" },
  { name: "Trần Minh Đức", handle: "minhduc_review", type: "ctv", tier: "gold", source: "Facebook", status: "active", code: "CTV000972" },
  { name: "Lê Thu Hương", handle: "thuong_affiliate", type: "agency", tier: "sapphire", source: "TikTok", status: "active", code: "DL000358" },
  { name: "Phạm Quang Huy", handle: "quanghuy_tn", type: "affiliate", tier: "gold", source: "Website", status: "pending", code: "AFF001301" },
  { name: "Đỗ Minh Trang", handle: "minhtrang_shop", type: "ctv", tier: "silver", source: "Zalo", status: "active", code: "CTV001045" },
  { name: "Vũ Đức Long", handle: "duclong_aff", type: "affiliate", tier: "gold", source: "YouTube", status: "active" },
  { name: "Hoàng Thị Ngọc", handle: "hoangngoc_dl", type: "agency", tier: "gold", source: "Facebook", status: "active" },
  { name: "Bùi Văn Nam", handle: "vannam_ctv", type: "ctv", tier: "silver", source: "TikTok", status: "active" },
];
const EXTRA = [
  ["Ngô Thu Bảo", "thubao_aff"], ["Lê Yến Vy", "yenvy_aff"], ["Nguyễn Gia Đức", "giaduc_aff"], ["Bùi Thu Vy", "thuvy_aff"],
  ["Ngô Văn Linh", "vanlinh_aff"], ["Hoàng Quang Khánh", "quangkhanh_aff"], ["Hoàng Quang Ngọc", "quangngoc_aff"],
  ["Hoàng Thị Huy", "thihuy_aff"], ["Vũ Văn Hương", "vanhuong_aff"], ["Nguyễn Minh Hương", "minhhuong_aff"],
  ["Bùi Văn Vy", "vanvy_aff"], ["Nguyễn Hoài Nhi", "hoainhi_aff"], ["Hoàng Thị Long", "thilong_aff"],
  ["Trần Gia Nam", "gianam_aff"], ["Trần Quang Hương", "quanghuong_aff"], ["Đỗ Ngọc My", "ngocmy_aff"],
  ["Dương Quang Long", "quanglong_aff"], ["Vũ Bảo Khánh", "baokhanh_aff"], ["Vũ Quang My", "quangmy_aff"],
  ["Nguyễn Đức Trang", "ductrang_aff"], ["Dương Yến Bảo", "yenbao_aff"], ["Nguyễn Văn Phúc", "vanphuc_aff"],
  ["Phạm Thị Lan", "thilan_aff"], ["Võ Minh Quân", "minhquan_ctv"], ["Lý Thanh Hà", "thanhha_shop"], ["Phan Hữu Dũng", "huudung_aff"],
  ["Trương Kim Chi", "kimchi_review"], ["Đặng Xuân Sơn", "xuanson_dl"], ["Bùi Hoài Phương", "hoaiphuong_aff"], ["Ngô Bảo Giang", "baogiang_aff"],
  ["Lê Anh Tuấn", "anhtuan_tn"], ["Trần Thanh Thảo", "thanhthao_aff"],
];
const SOURCES = ["TN MALL", "Facebook", "TikTok", "Website", "YouTube", "Zalo"];
const TIER_RATE: Record<string, number> = { bronze: 8, silver: 10, gold: 12, sapphire: 15 };

function noAccent(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
}

export function seedAdmin(db: DatabaseSync) {
  const rnd = mulberry32(20261127);
  const ri = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
  const wpick = (w: number[]) => {
    const t = w.reduce((a, b) => a + b, 0);
    let r = rnd() * t;
    for (let i = 0; i < w.length; i++) {
      r -= w[i];
      if (r <= 0) return i;
    }
    return w.length - 1;
  };

  const MIDNIGHT = Date.UTC(2026, 10, 27) - 7 * 3600e3; // local midnight today as UTC instant
  const DAY = 86400e3;
  const fmt = (ms: number) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");
  const NOW = Date.UTC(2026, 10, 27, 8, 30);

  // ---------- extra staff (display in Settings; unusable random passwords) ----------
  const staff: [string, string, string][] = [
    ["tran.hoang.minh@tnstrokeguard.local", "Trần Hoàng Minh", "accountant"],
    ["nguyen.quynh.anh@tnstrokeguard.local", "Nguyễn Quỳnh Anh", "accountant"],
    ["tran.quoc.bao@tnstrokeguard.local", "Trần Quốc Bảo", "partner_ops"],
    ["le.thu.ha@tnstrokeguard.local", "Lê Thu Hà", "policy"],
  ];
  const insStaff = db.prepare("INSERT OR IGNORE INTO admin_users (email,name,role,password_hash,created_at) VALUES (?,?,?,?,?)");
  staff.forEach(([e, n, r], i) => insStaff.run(e, n, r, hashPassword(`x${Math.random()}${i}`), fmt(MIDNIGHT - (200 - i * 20) * DAY)));

  // ---------- products from the store ----------
  const products = db
    .prepare("SELECT id,name,price,image FROM products WHERE status = 'active' ORDER BY id")
    .all() as { id: number; name: string; price: number; image: string | null }[];

  // ---------- partners ----------
  type P = { id: number; code: string; rate: number; status: string; w: number; joinedMs: number };
  const partners: P[] = [];
  const insPartner = db.prepare(
    `INSERT INTO partners (code,name,handle,email,phone,channel,tier,status,commission_rate,bank_name,bank_account,region,type,owner,province,joined_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  );
  const owners = ["Trần Quốc Bảo", "Lê Thu Hà", "Nguyễn Quỳnh Anh"];
  const banks = ["Vietcombank", "Techcombank", "MB Bank", "BIDV", "ACB", "VPBank"];
  const usedCodes = new Set<string>();
  const all: typeof NAMED = [...NAMED];
  EXTRA.forEach(([name, handle], i) => {
    const tiers = ["bronze", "bronze", "silver", "silver", "gold", "bronze"];
    const types = ["affiliate", "affiliate", "ctv", "ctv", "agency"];
    all.push({
      name, handle, type: pick(types), tier: tiers[i % tiers.length], source: pick(SOURCES),
      status: i === 3 || i === 9 || i === 14 || i === 18 ? "pending" : i === 6 || i === 16 ? "suspended" : "active",
    });
  });
  all.forEach((p, i) => {
    const prefix = p.type === "affiliate" ? "AFF" : p.type === "ctv" ? "CTV" : "DL";
    let code = p.code;
    while (!code || usedCodes.has(code)) code = `${prefix}${String(ri(1000, 1500)).padStart(6, "0")}`;
    usedCodes.add(code);
    const [prov, region] = PROVINCES[wpick(PROV_W)];
    const joinedMs = p.status === "pending" ? MIDNIGHT - ri(1, 12) * DAY : MIDNIGHT - ri(100, 320) * DAY;
    const slug = noAccent(p.name).toLowerCase().split(" ");
    const rate = i < 3 ? 15 : TIER_RATE[p.tier];
    insPartner.run(
      code, p.name, p.handle, `${slug[slug.length - 1]}.${slug[0]}${i}@affiliate.vn`,
      `09${ri(10000000, 99999999)}`, p.source, p.tier, p.status, rate, pick(banks), String(ri(10 ** 9, 10 ** 10 - 1)),
      region, p.type, pick(owners), prov, fmt(joinedMs),
    );
    const id = Number((db.prepare("SELECT id FROM partners WHERE code = ?").get(code) as { id: number }).id);
    const base = p.tier === "sapphire" ? 40 : p.tier === "gold" ? 22 : p.tier === "silver" ? 12 : 5;
    partners.push({ id, code, rate, status: p.status, w: Math.max(1, base * (0.6 + rnd())), joinedMs });
  });
  const activePartners = partners.filter((p) => p.status === "active");

  // ---------- customers ----------
  const insCust = db.prepare(
    "INSERT INTO customers (name,phone,email,address,province,partner_id,segment,source,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
  );
  type C = { id: number; name: string; phone: string; email: string; province: string; address: string; partner: P | null; w: number };
  const custs: C[] = [];
  const phones = new Set<string>();
  const streets = ["Nguyễn Trãi", "Lê Lợi", "Trần Hưng Đạo", "Hai Bà Trưng", "Phạm Văn Đồng", "Láng Hạ", "Cách Mạng Tháng 8", "Điện Biên Phủ"];
  for (let i = 0; i < 260; i++) {
    const name = `${pick(HO)} ${pick(DEM)} ${pick(TEN)}`;
    let phone = "";
    do phone = `0${pick(["90", "91", "93", "94", "96", "97", "98", "88", "35", "77"])}${ri(1000000, 9999999)}`;
    while (phones.has(phone));
    phones.add(phone);
    const [province] = PROVINCES[wpick(PROV_W)];
    const partner = rnd() < 0.62 ? activePartners[wpick(activePartners.map((p) => p.w))] : null;
    const address = `${ri(1, 250)} ${pick(streets)}, ${province}`;
    const email = `${noAccent(name).toLowerCase().replace(/\s+/g, ".")}${ri(1, 99)}@gmail.com`;
    const src = partner ? pick(["Facebook", "TikTok", "Zalo", "Website"]) : "Website";
    const r = insCust.run(name, phone, email, address, province, partner?.id ?? null, "potential", src, fmt(MIDNIGHT - ri(0, 89) * DAY));
    custs.push({ id: Number(r.lastInsertRowid), name, phone, email, province, address, partner, w: 0.3 + rnd() ** 2 * 3 });
  }

  // ---------- campaigns ----------
  const insCamp = db.prepare(
    "INSERT INTO campaigns (code,name,type,description,bonus_rate,budget,start_date,end_date,status,utm_code,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
  );
  const campDefs: [string, string, string, string, number, number, string, string, string][] = [
    ["CP-BF2026", "Black Friday 2026", "commission_boost", "Thưởng thêm hoa hồng + giảm giá cho đơn tuần Black Friday", 3, 1_500_000_000, "2026-11-20", "2026-11-30", "black_friday_2026"],
    ["CP-1111", "Sale 11.11 – Ngày độc thân", "flash_sale", "Flash sale 11.11 toàn bộ thực phẩm chức năng", 2, 800_000_000, "2026-11-08", "2026-11-12", "sale_11_11"],
    ["CP-TAMSOAT", "Tháng tầm soát đột quỵ", "commission_boost", "Đẩy mạnh gói tầm soát và máy đo huyết áp", 2, 600_000_000, "2026-10-01", "2026-10-31", "thang_tam_soat"],
    ["CP-COMBO12", "Ưu đãi Combo Tháng 12", "combo", "Combo thực phẩm chức năng + gói khám cuối năm", 2.5, 1_000_000_000, "2026-12-01", "2026-12-31", "combo_thang_12"],
    ["CP-TET2027", "Sale Tết 2027", "commission_boost", "Chiến dịch quà biếu Tết cho gia đình", 4, 2_500_000_000, "2027-01-05", "2027-02-05", "sale_tet_2027"],
    ["CP-TIKTOK", "Bùng nổ TikTok Q4", "channel", "Thưởng cho đối tác bán qua TikTok Shop / Live", 1.5, 500_000_000, "2026-09-15", "2026-10-15", "tiktok_q4"],
  ];
  const campaigns = campDefs.map((c) => {
    const r = insCamp.run(c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], "active", c[8], fmt(Date.parse(c[6]) - 10 * DAY));
    return { id: Number(r.lastInsertRowid), start: Date.parse(c[6]) - 7 * 3600e3, end: Date.parse(c[7]) + DAY - 7 * 3600e3, bonus: c[4] };
  });

  // ---------- orders ----------
  const insOrder = db.prepare(
    `INSERT INTO orders (code,customer_id,customer_name,customer_phone,customer_email,shipping_address,province,partner_id,campaign_id,source,subtotal,discount,shipping_fee,total,payment_method,payment_status,status,note,sync_status,created_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  );
  const insItem = db.prepare("INSERT INTO order_items (order_id,product_id,name,variant,image,price,quantity) VALUES (?,?,?,?,?,?,?)");
  const insComm = db.prepare(
    "INSERT INTO commissions (order_id,partner_id,base_amount,rate,amount,status,created_at) VALUES (?,?,?,?,?,?,?)",
  );
  let seq = 10000;
  const custOrders = new Map<number, { first: number; last: number; n: number; spent: number }>();
  const custW = custs.map((c) => c.w);
  for (let k = 89; k >= 0; k--) {
    const dayStart = MIDNIGHT - k * DAY;
    const dow = new Date(dayStart + 7 * 3600e3).getUTCDay();
    const growth = (90 - k) / 90;
    let vol = 3 + growth * 3 + (dow === 0 || dow === 6 ? 1.2 : 0) + rnd() * 2.5;
    if (dayStart >= Date.UTC(2026, 10, 20) - 7 * 3600e3) vol *= 1.6; // Black Friday
    if (dayStart >= Date.UTC(2026, 10, 8) - 7 * 3600e3 && dayStart < Date.UTC(2026, 10, 13) - 7 * 3600e3) vol *= 1.5; // 11.11
    const n = Math.round(vol);
    const times: number[] = [];
    for (let i = 0; i < n; i++) {
      const maxH = k === 0 ? 14 : 22;
      times.push(dayStart + ri(7, maxH) * 3600e3 + ri(0, 59) * 60e3);
    }
    times.sort((a, b) => a - b);
    for (const t of times) {
      const cust = custs[wpick(custW)];
      const partner =
        cust.partner && cust.partner.status === "active" && cust.partner.joinedMs < t && rnd() < 0.9
          ? cust.partner
          : !cust.partner && rnd() < 0.08
            ? activePartners[wpick(activePartners.map((p) => p.w))]
            : null;
      const camp = campaigns.find((c) => t >= c.start && t < c.end && rnd() < 0.45) ?? null;
      let subtotal = 0;
      const items: { p: (typeof products)[number]; q: number }[] = [];
      if (products.length) {
        const cnt = rnd() < 0.6 ? 1 : rnd() < 0.7 ? 2 : 3;
        const chosen = new Set<number>();
        while (items.length < Math.min(cnt, products.length)) {
          const p = pick(products);
          if (chosen.has(p.id)) continue;
          chosen.add(p.id);
          items.push({ p, q: rnd() < 0.8 ? 1 : 2 });
        }
        subtotal = items.reduce((s, i) => s + i.p.price * i.q, 0);
      } else subtotal = ri(3, 30) * 100_000;
      const discount = camp ? Math.round((subtotal * 0.05) / 1000) * 1000 : 0;
      const shipping = subtotal >= 500_000 ? 0 : 30_000;
      const total = subtotal - discount + shipping;
      const ageDays = (NOW - t) / DAY;
      const r = rnd();
      let status: string;
      if (ageDays > 14) status = r < 0.82 ? "completed" : r < 0.92 ? "cancelled" : r < 0.97 ? "returned" : "completed";
      else if (ageDays > 6) status = r < 0.55 ? "completed" : r < 0.8 ? "shipping" : r < 0.88 ? "confirmed" : r < 0.94 ? "cancelled" : "returned";
      else if (ageDays > 2) status = r < 0.2 ? "completed" : r < 0.5 ? "shipping" : r < 0.75 ? "confirmed" : r < 0.88 ? "pending" : "cancelled";
      else status = r < 0.5 ? "pending" : r < 0.8 ? "confirmed" : r < 0.93 ? "shipping" : "cancelled";
      const method = pick(["cod", "cod", "cod", "bank", "momo"]);
      const pay = status === "completed" ? "paid" : status === "returned" ? "refunded" : status === "cancelled" ? "unpaid" : method !== "cod" && status !== "pending" ? "paid" : "unpaid";
      const source = partner ? "affiliate" : camp ? "campaign" : rnd() < 0.82 ? "website" : "other";
      const d = new Date(t + 7 * 3600e3);
      const yymmdd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
      const code = `TM${yymmdd}-${++seq}`;
      const sync = rnd() < 0.015 ? "error" : "synced";
      const updated = status === "pending" ? t : Math.min(NOW, t + ri(2, 70) * 3600e3);
      const res = insOrder.run(
        code, cust.id, cust.name, cust.phone, cust.email, cust.address, cust.province, partner?.id ?? null, camp?.id ?? null,
        source, subtotal, discount, shipping, total, method, pay, status, null, sync, fmt(t), fmt(updated),
      );
      const oid = Number(res.lastInsertRowid);
      for (const it of items) insItem.run(oid, it.p.id, it.p.name, null, it.p.image, it.p.price, it.q);
      if (partner) {
        const rate = partner.rate + (camp ? camp.bonus : 0);
        const base = subtotal - discount;
        const amount = Math.floor((base * rate) / 100);
        const cs = status === "completed" ? "approved" : status === "cancelled" || status === "returned" ? "rejected" : "pending";
        insComm.run(oid, partner.id, base, rate, amount, cs, fmt(t));
      }
      if (status !== "cancelled") {
        const o = custOrders.get(cust.id) ?? { first: t, last: t, n: 0, spent: 0 };
        o.n++;
        o.last = Math.max(o.last, t);
        o.first = Math.min(o.first, t);
        if (status !== "returned") o.spent += total;
        custOrders.set(cust.id, o);
      }
    }
  }

  // customer segment + created_at coherent with first order
  const upCust = db.prepare("UPDATE customers SET segment = ?, created_at = ? WHERE id = ?");
  for (const c of custs) {
    const o = custOrders.get(c.id);
    if (!o) continue;
    const seg = NOW - o.last > 45 * DAY ? "dormant" : o.n >= 2 ? "repeat" : "bought";
    upCust.run(seg, fmt(o.first - ri(1, 48) * 3600e3), c.id);
  }

  // ---------- payout batches (past periods) ----------
  const insPayout = db.prepare(
    "INSERT INTO payouts (code,partner_id,period,amount,tax,method,status,note,batch,created_by,approved_by,created_at,paid_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
  );
  const updComm = db.prepare("UPDATE commissions SET status = 'paid', payout_id = ? WHERE id = ?");
  const batches: [string, string, string, string, string][] = [
    ["PAY-20261015-001", "T09/2026", "2026-10-01 00:00:00", "2026-08-01 00:00:00", "2026-10-15 03:00:00"],
    ["PAY-20261115-001", "T10/2026", "2026-11-01 00:00:00", "2026-10-01 00:00:00", "2026-11-15 03:00:00"],
  ];
  let poSeq = 100;
  for (const [batch, period, before, after, paidAt] of batches) {
    const rows = db
      .prepare(
        `SELECT c.id, c.partner_id, c.amount FROM commissions c JOIN orders o ON o.id = c.order_id
          WHERE c.status = 'approved' AND o.status = 'completed' AND o.created_at < ? AND o.created_at >= ?`,
      )
      .all(before, after) as { id: number; partner_id: number; amount: number }[];
    const byPartner = new Map<number, { ids: number[]; sum: number }>();
    for (const r of rows) {
      const e = byPartner.get(r.partner_id) ?? { ids: [], sum: 0 };
      e.ids.push(r.id);
      e.sum += r.amount;
      byPartner.set(r.partner_id, e);
    }
    for (const [pid, e] of byPartner) {
      const tax = e.sum >= 2_000_000 ? Math.floor(e.sum * 0.1) : 0;
      const res = insPayout.run(
        `PO${++poSeq}`, pid, period, e.sum, tax, "bank_transfer", "paid", null, batch,
        "Nguyễn Quỳnh Anh", "Trần Hoàng Minh", fmt(Date.parse(paidAt) - DAY), paidAt,
      );
      for (const id of e.ids) updComm.run(Number(res.lastInsertRowid), id);
    }
  }
  // a couple of held commissions
  db.exec(
    `UPDATE commissions SET status = 'held' WHERE id IN (SELECT c.id FROM commissions c WHERE c.status = 'approved' ORDER BY c.amount DESC LIMIT 2)`,
  );

  // ---------- trainings ----------
  const insTr = db.prepare(
    "INSERT INTO trainings (title,category,level,format,duration_minutes,lessons,enrolled,completion_rate,status,description) VALUES (?,?,?,?,?,?,?,?,?,?)",
  );
  const trs: [string, string, string, string, number, number, number, number, string][] = [
    ["Nhập môn Affiliate TN Stroke Guard", "required", "basic", "video", 90, 6, 38, 92, "Tổng quan chương trình, cách tạo link và theo dõi hoa hồng."],
    ["Kiến thức sản phẩm tầm soát & hỗ trợ tim mạch", "required", "basic", "video", 120, 8, 36, 81, "Thành phần, công dụng đã công bố và cách tư vấn đúng sản phẩm."],
    ["Quy định quảng cáo thực phẩm bảo vệ sức khỏe", "required", "basic", "document", 60, 4, 40, 97, "Không khẳng định công dụng phòng/chữa bệnh; nội dung phải được duyệt."],
    ["Kỹ năng livestream bán hàng", "optional", "advanced", "video", 100, 5, 21, 58, "Kịch bản, tương tác và chốt đơn khi livestream."],
    ["Chăm sóc khách hàng tái mua", "optional", "advanced", "video", 55, 3, 17, 64, "Quy trình chăm sóc sau bán và nhắc tái mua."],
  ];
  trs.forEach((t) => insTr.run(...t));

  // ---------- activity logs ----------
  const insLog = db.prepare("INSERT INTO activity_logs (actor,action,target,created_at) VALUES (?,?,?,?)");
  const logs: [string, string, string, number][] = [
    ["CEO Triệu Nhung", "policy.publish", "Chính sách v1.3 được kích hoạt", 60],
    ["Trần Quốc Bảo", "partner.bank.update", "Cập nhật tài khoản ngân hàng (giá trị đã che) – AFF001286", 40],
    ["Lê Thu Hà", "campaign.create", "Tạo chiến dịch Black Friday 2026", 12],
    ["Nguyễn Quỳnh Anh", "payout.create", "Lập đợt chi PAY-20261115-001 (T10/2026)", 13],
    ["Trần Hoàng Minh", "payout.approve", "Duyệt đợt chi PAY-20261115-001", 12.8],
    ["Trần Quốc Bảo", "application.approve", "Phê duyệt hồ sơ đối tác Nguyễn Văn Phúc", 9],
    ["Hệ thống", "integration.sync", "Đồng bộ TN MALL thành công (mock)", 1],
    ["CEO Triệu Nhung", "product.update", "Cập nhật giá & hoa hồng sản phẩm", 3],
    ["Trần Quốc Bảo", "partner.suspend", "Tạm dừng đối tác do dấu hiệu bất thường", 5],
    ["Lê Thu Hà", "campaign.toggle", "Tạm dừng chiến dịch Bùng nổ TikTok Q4", 44],
  ];
  logs.forEach(([a, b, c, d]) => insLog.run(a, b, c, fmt(NOW - d * DAY)));

  // ---------- webhook logs ----------
  const insHook = db.prepare("INSERT INTO webhook_logs (event,status,message,created_at) VALUES (?,?,?,?)");
  const hooks: [string, string, string, number][] = [
    ["order.created", "success", "Nhận webhook: đơn mới từ TN MALL (mock)", 0.02],
    ["order.completed", "success", "Đơn hoàn thành – cập nhật hoa hồng (mock)", 0.2],
    ["sync.pull", "success", "Đồng bộ bù theo since= (mock)", 0.4],
    ["order.created", "error", "Lỗi kết nối API TN MALL (HTTP 503) (mock)", 1.1],
    ["sync.retry", "success", "Tự động thử lại sau 60 giây – thành công", 1.1],
    ["order.refunded", "success", "Hoàn trả đơn – tạo bút toán đảo hoa hồng (mock)", 2.3],
    ["order.created", "success", "Nhận webhook: đơn mới từ TN MALL (mock)", 3.5],
    ["product.sync", "success", "Đồng bộ danh mục sản phẩm (mock)", 5],
  ];
  hooks.forEach(([a, b, c, d]) => insHook.run(a, b, c, fmt(NOW - d * DAY)));

  // ---------- settings ----------
  const set = db.prepare("INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)");
  set.run("policy_version", "v1.3");
  set.run("cookie_days", "30");
  set.run("return_window_days", "7");
  set.run("min_payout", "500000");
  set.run("tax_rate", "10");
  set.run("tax_threshold", "2000000");
  set.run("default_commission_rate", "10");
  set.run("payout_day", "15");
  set.run("shipping_free_threshold", "500000");
  set.run(
    "tiers",
    JSON.stringify([
      { key: "bronze", name: "Bronze", min_gmv: 0, rate: 8 },
      { key: "silver", name: "Silver", min_gmv: 50_000_000, rate: 10 },
      { key: "gold", name: "Gold", min_gmv: 150_000_000, rate: 12 },
      { key: "sapphire", name: "Sapphire", min_gmv: 400_000_000, rate: 15 },
    ]),
  );
  set.run("tnmall_mode", "mock");
  set.run("tnmall_base_url", "https://api.tnmall.vn/v1");
  set.run("tnmall_api_key", "demo_key_••••••••");
  set.run("tnmall_webhook_secret", "whsec_••••••••");
  set.run("tnmall_auto_sync", "1");
  set.run("tnmall_last_sync", fmt(NOW - 3600e3));
}
