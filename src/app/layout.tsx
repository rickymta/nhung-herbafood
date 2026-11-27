import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TNStrokeGuard — Hệ Thống Tầm Soát Đột Quỵ & Chăm Sóc Sức Khỏe Chủ Động",
  description:
    "Nhà thuốc & tầm soát tim mạch - đột quỵ: đánh giá nguy cơ đột quỵ 10 năm, sàng lọc rung nhĩ, dược phẩm và gói khám chính hãng.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
