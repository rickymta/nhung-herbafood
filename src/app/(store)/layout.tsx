import type { Metadata } from "next";
import { CartProvider } from "@/components/store/cart";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { CookieBanner, FloatingButtons } from "@/components/store/FloatingUi";
import { getSettings } from "@/lib/store/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TNStrokeGuard — Hệ Thống Tầm Soát Đột Quỵ & Chăm Sóc Sức Khỏe Chủ Động",
};

export default function StoreLayout({ children }: LayoutProps<"/">) {
  const s = getSettings();
  const hotline = s.hotline || "1900 6789";
  const zalo = s.zalo_url || "https://zalo.me/0933991990";
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#EDF0F5] text-slate-900">
        <Header hotline={hotline} zaloUrl={zalo} />
        <main>{children}</main>
        <Footer hotline={hotline} hours={s.hotline_hours || "8:00-22:00"} zaloUrl={zalo} />
        <FloatingButtons hotline={hotline} zaloUrl={zalo} />
        <CookieBanner />
      </div>
    </CartProvider>
  );
}
