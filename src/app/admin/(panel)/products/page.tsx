import Link from "next/link";
import { Pencil, Plus, Power, Trash2, Package, CheckCircle2, Zap, AlertTriangle } from "lucide-react";
import { CATEGORY_LABEL, getProduct, listProducts, productKpis } from "@/lib/admin/products";
import { type SP, sp1 } from "@/lib/admin/common";
import { Badge, Card, Field, Kpi, Modal, PageHeader, Pagination, href, Thumb } from "@/components/admin/ui";
import { ConfirmButton, FilterForm } from "@/components/admin/client";
import { num, vndAdmin, discountPercent } from "@/lib/format";
import { deleteProductAction, saveProductAction, toggleProductAction } from "./actions";

export default async function ProductsPage({ searchParams }: PageProps<"/admin/products">) {
  const sp = (await searchParams) as SP;
  const base = "/admin/products";
  const { rows, pg } = listProducts(sp);
  const k = productKpis();
  const editParam = sp1(sp.edit);
  const edit = editParam && editParam !== "new" ? getProduct(Number(editParam)) : null;
  const closeHref = href(base, sp, { edit: null });
  const here = href(base, sp);
  const blank = { name: "", sku: "", brand: "", category: "supplement", price: 0, original_price: null, unit: "Hộp", pack_size: "", image: "", stock: 100, commission_rate: 10, status: "active", flash_sale: 0, flash_limit: 0, featured: 1, has_gift: 0, short_description: "", description: "" };
  const form = edit ?? (editParam === "new" ? blank : null);
  return (
    <>
      <PageHeader title="Sản phẩm & chiến dịch Affiliate" sub="Quản lý danh mục sản phẩm của cửa hàng — thay đổi hiển thị ngay trên storefront">
        <Link className="adm-btn p" href={href(base, sp, { edit: "new" })}><Plus size={16} /> Thêm sản phẩm</Link>
      </PageHeader>
      <div className="adm-grid adm-g4">
        <Kpi label="Tổng sản phẩm" value={k.total} icon={<Package size={18} />} sub={`${k.active} đang hiển thị trên cửa hàng`} />
        <Kpi label="Đang mở Affiliate" value={k.active} icon={<CheckCircle2 size={18} />} sub="Sản phẩm trạng thái hoạt động" />
        <Kpi label="Flash sale" value={k.flash} icon={<Zap size={18} />} sub={`${k.camp} chiến dịch đang bật`} />
        <Kpi label="Hoa hồng trung bình" kind="pct" value={k.avg} icon={<AlertTriangle size={18} />} sub={`${k.lowStock} sản phẩm tồn kho < 20`} />
      </div>

      <FilterForm action={base}>
        <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm tên, SKU…" />
        <select className="adm-select" name="category" defaultValue={sp1(sp.category)}><option value="">Danh mục: Tất cả</option>{Object.entries(CATEGORY_LABEL).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
        <select className="adm-select" name="status" defaultValue={sp1(sp.status)}><option value="">Trạng thái</option><option value="active">Đang mở</option><option value="hidden">Đã đóng</option></select>
        <Link className="adm-btn sm" href={base}>Xóa lọc</Link>
      </FilterForm>

      <Card flush title={`Danh sách sản phẩm (${pg.total})`}>
        <div className="adm-tblwrap"><table className="adm-tbl">
          <thead><tr><th>#</th><th>Sản phẩm</th><th>SKU</th><th className="r">Giá bán</th><th className="r">Hoa hồng</th><th className="r">Tồn kho</th><th className="r">Đã bán</th><th>Affiliate</th><th>Flash sale</th><th /></tr></thead>
          <tbody>{rows.map((p, i) => (
            <tr key={p.id}>
              <td>{pg.offset + i + 1}</td>
              <td><div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Thumb src={p.image} />
                <span><b>{p.name}</b><br /><Badge tone="gray">{CATEGORY_LABEL[p.category] ?? p.category}</Badge></span></div></td>
              <td>{p.sku}</td>
              <td className="r">{vndAdmin(p.price)}{p.original_price ? <><br /><span className="mut" style={{ textDecoration: "line-through" }}>{vndAdmin(p.original_price)}</span> <span className="up" style={{ fontSize: 12 }}>-{discountPercent(p.price, p.original_price)}%</span></> : null}</td>
              <td className="r">{num(p.commission_rate, 1)}%</td>
              <td className="r" style={{ color: p.stock < 20 ? "#b91c1c" : undefined, fontWeight: p.stock < 20 ? 700 : undefined }}>{num(p.stock)}</td>
              <td className="r">{num(p.qty)}</td>
              <td><span style={{ fontWeight: 600, color: p.status === "active" ? "#15803d" : "#64748b" }}>{p.status === "active" ? "Đang mở" : "Đã đóng"}</span></td>
              <td>{p.flash_sale ? <Badge tone="orange">Flash {p.flash_sold}/{p.flash_limit}</Badge> : <span className="mut">—</span>}</td>
              <td><div style={{ display: "flex", gap: 6 }}>
                <Link className="adm-ib" href={href(base, sp, { edit: p.id })} title="Sửa"><Pencil size={14} /></Link>
                <form action={toggleProductAction}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="_back" value={here} /><button className="adm-ib" title={p.status === "active" ? "Đóng bán" : "Mở bán"}><Power size={14} /></button></form>
              </div></td>
            </tr>))}
            {!rows.length && <tr><td colSpan={10} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Không có sản phẩm.</td></tr>}
          </tbody></table></div>
        <Pagination pg={pg} base={base} sp={sp} noun="sản phẩm" />
      </Card>

      {form && (
        <Modal title={edit ? `Sửa sản phẩm #${edit.id}` : "Thêm sản phẩm"} closeHref={closeHref} wide>
          <form action={saveProductAction}>
            {edit && <input type="hidden" name="id" value={edit.id} />}
            <input type="hidden" name="_back" value={closeHref} />
            <div className="adm-fgrid">
              <Field label="Tên sản phẩm *" full><input className="adm-input" name="name" defaultValue={form.name} required /></Field>
              <Field label="SKU"><input className="adm-input" name="sku" defaultValue={form.sku} /></Field>
              <Field label="Thương hiệu"><input className="adm-input" name="brand" defaultValue={form.brand} /></Field>
              <Field label="Danh mục"><select className="adm-select" name="category" defaultValue={form.category}>{Object.entries(CATEGORY_LABEL).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select></Field>
              <Field label="Trạng thái"><select className="adm-select" name="status" defaultValue={form.status}><option value="active">Đang mở (hiển thị)</option><option value="hidden">Đã đóng (ẩn)</option></select></Field>
              <Field label="Giá bán (₫) *"><input className="adm-input" type="number" name="price" min={0} step={1000} defaultValue={form.price} required /></Field>
              <Field label="Giá gốc (₫)"><input className="adm-input" type="number" name="original_price" min={0} step={1000} defaultValue={form.original_price ?? ""} /></Field>
              <Field label="Tồn kho"><input className="adm-input" type="number" name="stock" min={0} defaultValue={form.stock} /></Field>
              <Field label="Hoa hồng (%)"><input className="adm-input" type="number" name="commission_rate" min={0} max={50} step={0.5} defaultValue={form.commission_rate} /></Field>
              <Field label="Đơn vị"><input className="adm-input" name="unit" defaultValue={form.unit} /></Field>
              <Field label="Quy cách"><input className="adm-input" name="pack_size" defaultValue={form.pack_size ?? ""} /></Field>
              <Field label="URL ảnh" full><input className="adm-input" name="image" defaultValue={form.image ?? ""} placeholder="https://…" /></Field>
              <Field label="Mô tả ngắn" full><input className="adm-input" name="short_description" defaultValue={form.short_description ?? ""} /></Field>
              <Field label="Mô tả chi tiết" full><textarea className="adm-textarea" name="description" defaultValue={form.description ?? ""} /></Field>
              <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }} className="full">
                <label><input type="checkbox" name="flash_sale" defaultChecked={!!form.flash_sale} /> Flash sale</label>
                <label>Giới hạn flash: <input className="adm-input" style={{ width: 90, display: "inline-block" }} type="number" name="flash_limit" min={0} defaultValue={form.flash_limit} /></label>
                <label><input type="checkbox" name="featured" defaultChecked={!!form.featured} /> Nổi bật</label>
                <label><input type="checkbox" name="has_gift" defaultChecked={!!form.has_gift} /> Có quà tặng</label>
              </div>
            </div>
            <div className="mf" style={{ justifyContent: "space-between" }}>
              <div>{edit && <ConfirmButton formAction={deleteProductAction} className="adm-btn d" message={`Xóa sản phẩm “${edit.name}”?`}><Trash2 size={15} /> Xóa</ConfirmButton>}</div>
              <div style={{ display: "flex", gap: 10 }}><Link className="adm-btn" href={closeHref}>Hủy</Link><button className="adm-btn p">Lưu</button></div>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
