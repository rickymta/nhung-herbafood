import { getCurrentAdmin } from "@/lib/auth";
import { all } from "@/lib/db";

export const dynamic = "force-dynamic";

const QUERIES: Record<string, { sql: string; head: string[] }> = {
  partners: {
    head: ["Mã", "Họ tên", "Email", "Loại", "Cấp bậc", "Nguồn", "Khu vực", "Trạng thái", "Tỷ lệ HH %", "Ngày đăng ký"],
    sql: "SELECT code,name,email,type,tier,channel,region,status,commission_rate,joined_at FROM partners ORDER BY id",
  },
  customers: {
    head: ["Họ tên", "SĐT", "Email", "Tỉnh/TP", "Nguồn", "Trạng thái", "Ngày ghi nhận"],
    sql: "SELECT name,phone,email,province,source,segment,created_at FROM customers ORDER BY id",
  },
  orders: {
    head: ["Mã đơn", "Khách hàng", "SĐT", "Tỉnh/TP", "Đối tác", "Tổng tiền", "Thanh toán", "Trạng thái", "Đồng bộ", "Thời gian"],
    sql: `SELECT o.code,o.customer_name,o.customer_phone,o.province,p.code,o.total,o.payment_status,o.status,o.sync_status,o.created_at FROM orders o LEFT JOIN partners p ON p.id=o.partner_id ORDER BY o.created_at DESC`,
  },
  commissions: {
    head: ["Đơn", "Đối tác", "Doanh số", "Tỷ lệ %", "Hoa hồng", "Điều chỉnh", "Trạng thái", "Thời gian"],
    sql: `SELECT o.code,p.code,c.base_amount,c.rate,c.amount,c.adjustment,c.status,c.created_at FROM commissions c JOIN orders o ON o.id=c.order_id JOIN partners p ON p.id=c.partner_id ORDER BY c.created_at DESC`,
  },
  payouts: {
    head: ["Đợt chi", "Mã", "Đối tác", "Ngân hàng", "Số tài khoản", "Kỳ", "Số tiền", "Thuế", "Thực nhận", "Trạng thái", "Ngày chi"],
    sql: `SELECT po.batch,po.code,p.name,p.bank_name,p.bank_account,po.period,po.amount,po.tax,po.amount-po.tax,po.status,po.paid_at FROM payouts po JOIN partners p ON p.id=po.partner_id ORDER BY po.created_at DESC, po.id`,
  },
};

const esc = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET(_req: Request, ctx: RouteContext<"/admin/export/[kind]">) {
  if (!(await getCurrentAdmin())) return new Response("Unauthorized", { status: 401 });
  const { kind } = await ctx.params;
  const q = QUERIES[kind];
  if (!q) return new Response("Not found", { status: 404 });
  const rows = all<Record<string, unknown>>(q.sql);
  const body = [q.head.join(","), ...rows.map((r) => Object.values(r).map(esc).join(","))].join("\n");
  return new Response("﻿" + body, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${kind}-${new Date().toISOString().slice(0, 10)}.csv"` },
  });
}
