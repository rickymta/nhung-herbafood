import Link from "next/link";
import { all } from "@/lib/db";
import { Card, PageHeader } from "@/components/admin/ui";
import { vndAdmin } from "@/lib/format";
import { type SP, sp1 } from "@/lib/admin/common";

export default async function SearchPage({ searchParams }: PageProps<"/admin/search">) {
  const sp = (await searchParams) as SP;
  const q = sp1(sp.q).trim();
  const like = `%${q}%`;
  const partners = q ? all<{ code: string; name: string; handle: string }>("SELECT code,name,handle FROM partners WHERE name LIKE ? OR code LIKE ? OR handle LIKE ? OR email LIKE ? LIMIT 8", [like, like, like, like]) : [];
  const customers = q ? all<{ id: number; name: string; phone: string }>("SELECT id,name,phone FROM customers WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? LIMIT 8", [like, like, like]) : [];
  const orders = q ? all<{ code: string; customer_name: string; total: number }>("SELECT code,customer_name,total FROM orders WHERE code LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ? ORDER BY created_at DESC LIMIT 8", [like, like, like]) : [];
  const camps = q ? all<{ name: string; code: string }>("SELECT name,code FROM campaigns WHERE name LIKE ? OR code LIKE ? LIMIT 8", [like, like]) : [];
  const products = q ? all<{ id: number; name: string; sku: string }>("SELECT id,name,sku FROM products WHERE name LIKE ? OR sku LIKE ? LIMIT 8", [like, like]) : [];
  const none = !partners.length && !customers.length && !orders.length && !camps.length && !products.length;
  return (
    <>
      <PageHeader title="Kết quả tìm kiếm" sub={q ? `Từ khóa: “${q}”` : "Nhập từ khóa ở ô tìm kiếm phía trên (Ctrl + K)"} />
      {q && none && <Card>Không tìm thấy kết quả phù hợp.</Card>}
      <div className="adm-grid adm-g2">
        {partners.length > 0 && <Card title="Đối tác"><div className="adm-list">{partners.map((p) => <div key={p.code}><Link className="lnk" href={`/admin/partners/${p.code}`} style={{ flex: 1 }}><b>{p.name}</b> <span style={{ color: "var(--muted)" }}>@{p.handle} · {p.code}</span></Link></div>)}</div></Card>}
        {customers.length > 0 && <Card title="Khách hàng"><div className="adm-list">{customers.map((c) => <div key={c.id}><Link href={`/admin/customers?view=${c.id}&q=${encodeURIComponent(c.name)}`} style={{ flex: 1 }}><b>{c.name}</b> <span style={{ color: "var(--muted)" }}>{c.phone}</span></Link></div>)}</div></Card>}
        {orders.length > 0 && <Card title="Đơn hàng"><div className="adm-list">{orders.map((o) => <div key={o.code}><Link href={`/admin/orders?view=${o.code}`} style={{ flex: 1 }}><b>{o.code}</b> <span style={{ color: "var(--muted)" }}>{o.customer_name} · {vndAdmin(o.total)}</span></Link></div>)}</div></Card>}
        {camps.length > 0 && <Card title="Chiến dịch"><div className="adm-list">{camps.map((c) => <div key={c.code}><Link href="/admin/campaigns" style={{ flex: 1 }}><b>{c.name}</b> <span style={{ color: "var(--muted)" }}>{c.code}</span></Link></div>)}</div></Card>}
        {products.length > 0 && <Card title="Sản phẩm"><div className="adm-list">{products.map((p) => <div key={p.id}><Link href={`/admin/products?edit=${p.id}`} style={{ flex: 1 }}><b>{p.name}</b> <span style={{ color: "var(--muted)" }}>{p.sku}</span></Link></div>)}</div></Card>}
      </div>
    </>
  );
}
