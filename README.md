# TN Stroke Guard — Storefront + Affiliate Admin

Ứng dụng thương mại điện tử nhà thuốc & tầm soát đột quỵ, gồm:

- **Storefront** (giao diện clone từ https://tn-stroke-guard.vercel.app/) — trang chủ, nhà thuốc, chi tiết sản phẩm, giỏ hàng, thanh toán, bài đánh giá nguy cơ đột quỵ (tổng quát & CHA₂DS₂-VASc), B.E.F.A.S.T, góc sức khỏe, tra cứu đơn.
- **Trang quản trị** `/admin` (giao diện clone từ https://tn-affiliate-os.vercel.app/) — tổng quan điều hành, đối tác affiliate, khách hàng, đơn hàng, hoa hồng & đối soát, thanh toán, chiến dịch, sản phẩm, báo cáo, đào tạo, tích hợp, cài đặt, nội dung, đánh giá nguy cơ.

Công nghệ: **Next.js 16** (App Router) · **SQLite** (module có sẵn `node:sqlite`, không cần build native) · Tailwind CSS v4 · Recharts · lucide-react.

## Yêu cầu

- Node.js **>= 22.13**

## Chạy dự án

```bash
npm install
npm run dev
```

- Storefront: http://localhost:3000
- Quản trị: http://localhost:3000/admin/login

Lần chạy đầu, CSDL `data/app.db` được tạo và seed dữ liệu mẫu tự động (sản phẩm, bài viết, ~40 đối tác, ~590 đơn trong 90 ngày, hoa hồng, chi trả…).

### Tài khoản quản trị

Tạo khi seed, lấy từ biến môi trường (xem `.env.example`). Nếu không đặt, dùng giá trị mặc định trong `src/lib/seed.ts`. **Đổi mật khẩu ngay** trong Cài đặt khi triển khai thật.

### Seed lại dữ liệu

```bash
rm -f data/app.db*
```

Rồi khởi động lại server.

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run dev` | Chạy môi trường phát triển |
| `npm run build` / `npm start` | Build & chạy production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Sinh type route rồi chạy `tsc --noEmit` |

## Luồng affiliate

Gắn `?ref=MÃ_ĐỐI_TÁC` (vd. `?ref=AFF001286`) vào bất kỳ link storefront → cookie 30 ngày → khi khách đặt hàng, đơn được gắn đối tác và tạo hoa hồng (tỷ lệ đối tác + thưởng chiến dịch đang chạy). Admin duyệt đơn → hoa hồng được duyệt → tạo đợt chi trả → đánh dấu đã trả.

Chi tiết kiến trúc: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Spec khảo sát 2 site mẫu: [docs/survey/](docs/survey/).

## Ghi chú

- Ảnh sản phẩm/banner đang trỏ URL tuyệt đối tới site mẫu `tn-stroke-guard.vercel.app`.
- RBAC trong Cài đặt hiện chỉ hiển thị, chưa phân quyền thực thi.
