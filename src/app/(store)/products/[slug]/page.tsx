import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Headset, Star, Check } from "lucide-react";
import { DetailTabs, ProductBuyBox, ProductGallery } from "@/components/store/ProductDetailClient";
import { ProductCard } from "@/components/store/ProductCard";
import { getProduct, getSettings, relatedProducts } from "@/lib/store/queries";
import { CATEGORY_LABEL, COUNTRY_FLAG } from "@/lib/store/types";

export async function generateMetadata({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  return { title: p ? `${p.name} — TNStrokeGuard` : "Sản phẩm" };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const rel = relatedProducts(p);
  const s = getSettings();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-orange-600">Trang chủ</Link><ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-orange-600">Nhà thuốc & Gói khám</Link><ChevronRight className="h-3 w-3" />
        <Link href={`/products?category=${p.category}`} className="hover:text-orange-600">{CATEGORY_LABEL[p.category] ?? "Sản phẩm"}</Link><ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 text-slate-800">{p.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 rounded-3xl bg-white p-5 shadow-sm md:p-8 lg:grid-cols-[480px_1fr]">
        <ProductGallery p={p} />
        <div>
          <p className="text-sm font-bold text-slate-500">{COUNTRY_FLAG[p.origin] ?? ""} {p.origin}{p.brand && <> · Thương hiệu: <span className="text-orange-600">{p.brand}</span></>} · <span className="text-emerald-600">{p.stock > 0 ? "Sẵn hàng tại nhà thuốc" : "Tạm hết hàng"}</span></p>
          <h1 className="mt-2 text-[26px] font-black leading-tight text-slate-900">{p.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 text-[13px] font-semibold text-slate-500">
            <span>MSP: {p.sku}</span>
            <span className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-current" />{p.rating.toFixed(1)}</span>
            <span>{p.reviewCount} đánh giá</span><span>{Math.round(p.reviewCount * 0.43)} bình luận</span>
            <span>Đã bán {p.soldCount}</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{p.shortDescription}</p>
          <div className="mt-5 border-t border-slate-100 pt-5"><ProductBuyBox p={p} /></div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl bg-white p-5 shadow-sm md:p-8"><DetailTabs p={p} /></div>
        <div className="space-y-4 lg:self-start">
          <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-[0_10px_30px_rgba(234,88,12,0.35)]">
            <Headset className="h-8 w-8" />
            <div className="mt-3 text-sm font-bold opacity-90">Hỗ trợ chuyên gia y tế</div>
            <div className="text-2xl font-black">{s.pharmacist_hotline || "1900 1234"} (24/7)</div>
            <p className="mt-1 text-sm font-medium opacity-90">Tổng đài Dược sĩ tư vấn miễn phí</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="text-sm font-black text-slate-900">Chính sách giao hàng & bảo quản</div>
            <ul className="mt-3 space-y-2.5 text-[13.5px] font-medium text-slate-600">
              {["Được mở hộp kiểm tra hàng trước khi thanh toán.", "Bảo quản chuẩn kho GPP nhiệt độ dưới 25°C.", "Xuất hóa đơn điện tử VAT đầy đủ khi yêu cầu."].map((t) => (
                <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-black text-slate-900">Sản phẩm cùng chuyên khoa Tim mạch & Đột quỵ</h2>
          <Link href="/products" className="text-sm font-bold text-orange-600">Xem tất cả ›</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">{rel.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </section>
    </div>
  );
}
