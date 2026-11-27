import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { listProducts, productFacets, type ProductFilter } from "@/lib/store/queries";
import { CATEGORY_LABEL } from "@/lib/store/types";

export const metadata = { title: "Nhà thuốc & Gói khám — TNStrokeGuard" };

const PRICES = [
  ["under100", "Dưới 100.000đ"], ["100-300", "100.000đ đến 300.000đ"], ["300-500", "300.000đ đến 500.000đ"], ["over500", "Trên 500.000đ"],
];

function Chip({ active, to, children }: { active: boolean; to: string; children: React.ReactNode }) {
  return (
    <Link href={to} className={`block rounded-xl px-3 py-2 text-[13px] font-semibold transition ${active ? "bg-orange-600 text-white" : "text-slate-600 hover:bg-orange-50"}`}>{children}</Link>
  );
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const f: ProductFilter = {
    q: one("q"), category: one("category"), price: one("price"), brand: one("brand"), origin: one("origin"),
    sort: (one("sort") as ProductFilter["sort"]) || "bestseller",
  };
  const items = listProducts(f);
  const { brands, origins } = productFacets();

  const href = (patch: Record<string, string | undefined>) => {
    const cur: Record<string, string | undefined> = { q: f.q, category: f.category, price: f.price, brand: f.brand, origin: f.origin, sort: one("sort"), ...patch };
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries(cur)) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `/products?${s}` : "/products";
  };
  const title = f.category ? CATEGORY_LABEL[f.category] ?? "Danh sách sản phẩm" : "Danh sách sản phẩm";

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-orange-600">Trang chủ</Link><ChevronRight className="h-3 w-3" /><span className="text-slate-800">Danh sách sản phẩm</span>
      </nav>
      <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-[13px] font-semibold text-orange-800">
        Lưu ý: 100% sản phẩm TPBVSK & Dược phẩm chuẩn GMP Nhật Bản kiểm định rõ ràng — Đặt mua trực tuyến không cần tài khoản, xác nhận đơn an toàn qua điện thoại.
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5 rounded-3xl bg-white p-5 shadow-sm lg:self-start">
          <div className="flex items-center gap-2 text-sm font-black text-slate-900"><SlidersHorizontal className="h-4 w-4 text-orange-600" />Bộ lọc nâng cao</div>
          <div>
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">Danh mục</div>
            <Chip active={!f.category} to={href({ category: undefined })}>Tất cả</Chip>
            {Object.entries(CATEGORY_LABEL).map(([k, v]) => <Chip key={k} active={f.category === k} to={href({ category: k })}>{v}</Chip>)}
          </div>
          <div>
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">Giá bán</div>
            <Chip active={!f.price} to={href({ price: undefined })}>Tất cả mức giá</Chip>
            {PRICES.map(([k, v]) => <Chip key={k} active={f.price === k} to={href({ price: k })}>{v}</Chip>)}
          </div>
          <div>
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">Thương hiệu</div>
            <Chip active={!f.brand} to={href({ brand: undefined })}>Tất cả</Chip>
            {brands.map((b) => <Chip key={b} active={f.brand === b} to={href({ brand: b })}>{b}</Chip>)}
          </div>
          <div>
            <div className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-400">Nước sản xuất</div>
            <Chip active={!f.origin} to={href({ origin: undefined })}>Tất cả</Chip>
            {origins.map((b) => <Chip key={b} active={f.origin === b} to={href({ origin: b })}>{b}</Chip>)}
          </div>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{f.q ? `Kết quả cho "${f.q}"` : title}</h1>
              <p className="text-sm font-medium text-slate-500">{items.length} sản phẩm</p>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <span className="text-slate-500">Sắp xếp theo:</span>
              {([["bestseller", "Bán chạy"], ["price_asc", "Giá thấp"], ["price_desc", "Giá cao"]] as const).map(([k, l]) => (
                <Link key={k} href={href({ sort: k })} className={`rounded-full px-3.5 py-1.5 ${f.sort === k ? "bg-orange-600 text-white" : "bg-white text-slate-600 hover:bg-orange-50"}`}>{l}</Link>
              ))}
            </div>
          </div>
          {items.length === 0 ? (
            <div className="mt-6 rounded-3xl bg-white p-12 text-center">
              <p className="text-lg font-extrabold text-slate-800">Không tìm thấy sản phẩm phù hợp</p>
              <Link href="/products" className="mt-4 inline-block rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white">Xóa bộ lọc</Link>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
              {items.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
