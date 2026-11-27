# Kiến trúc dự án

Next.js 16 (App Router, `src/`) + SQLite (module có sẵn `node:sqlite`, Node >= 22.13) + Tailwind CSS v4.

- **Storefront** (clone https://tn-stroke-guard.vercel.app/) — route group `src/app/(store)/`.
- **Admin** (clone https://tn-affiliate-os.vercel.app/) — `src/app/admin/`, đăng nhập tại `/admin/login`.

## Quy ước

| Hạng mục | Quy ước |
|---|---|
| Kết nối DB | `src/lib/db.ts` — `all/get/run/tx/parseJson`. Đồng bộ, chỉ dùng phía server. |
| Schema | `src/lib/schema.ts` (CREATE IF NOT EXISTS). Thay đổi schema → sửa file này và xoá `data/app.db` để seed lại. |
| Seed | `src/lib/seed.ts` gọi `seed/store.ts` (danh mục, sản phẩm, bài viết, video) rồi `seed/admin.ts` (đối tác, khách hàng, đơn, hoa hồng, chi trả, chiến dịch, đào tạo). Chạy 1 lần khi DB trống. |
| Truy vấn | Storefront: `src/lib/store/*.ts`. Admin: `src/lib/admin/*.ts`. |
| Ghi dữ liệu | Server Actions (`"use server"`) trong `src/app/**/actions.ts`; sau khi ghi gọi `revalidatePath`. |
| Render | `cacheComponents` tắt. Layout `(store)` và `admin/(panel)` đặt `export const dynamic = "force-dynamic"` để luôn đọc dữ liệu mới. |
| Auth admin | `src/lib/auth.ts` — `requireAdmin()` ở đầu mọi page/action admin; `src/proxy.ts` chặn sớm khi thiếu cookie. |
| Affiliate | `?ref=MÃ` trên bất kỳ URL storefront → cookie `tn_ref` 30 ngày → checkout gắn `partner_id`, tạo bản ghi `commissions` (pending). |
| Định dạng | `src/lib/format.ts` — `vnd()` (storefront `849.000đ`), `vndAdmin()` (`12.850.000.000 ₫`), `dateVN()`, `initials()`, `slugify()`, `genCode()`. |
| Icon / chart | `lucide-react`, `recharts`. |
| Ảnh | Ảnh sản phẩm/banner dùng URL tuyệt đối từ site mẫu (`https://tn-stroke-guard.vercel.app/...`), dùng `<img>` thường. |

## Luồng nghiệp vụ chính

1. Khách xem sản phẩm → giỏ hàng (localStorage) → checkout (server action) → tạo `customers` (theo SĐT), `orders`, `order_items`; nếu có cookie `tn_ref` hợp lệ → gắn đối tác + tạo `commissions` = tổng tiền hàng × `commission_rate` đối tác (+ `bonus_rate` của chiến dịch đang chạy).
2. Khách làm bài đánh giá nguy cơ → lưu `assessments` → trang kết quả.
3. Admin duyệt đơn (đổi trạng thái) → hoa hồng: đơn `completed` → `approved`; `cancelled/returned` → `rejected`.
4. Admin tạo kỳ chi trả: gom hoa hồng `approved` của đối tác → `payouts` → đánh dấu đã trả → hoa hồng `paid`.
