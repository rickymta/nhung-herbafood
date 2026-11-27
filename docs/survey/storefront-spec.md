# TNStrokeGuard storefront spec

Source: https://tn-stroke-guard.vercel.app/ (Vite React SPA, Vietnamese). Captured 2026-11-27 via read-only browser inspection. Structured data lives in `storefront-data.json` in this folder.

## Coverage and gaps

- Captured: all listed routes except the items below.
- Not captured: assessment step 2 (questions and result bands) for both `/assessment/general` and `/assessment/afib`, because step 1 needs name, phone and birth year. Not entered. The CHA2DS2-VASc points table is captured.
- Not captured: checkout form. Clicking "Tiến hành đặt hàng (Xác thực OTP)" likely sends an OTP, so it was not clicked.
- Not verified: per-component computed styles beyond the sampled ones, cookie banner layout, floating button positions, carousel behaviour.
- Product list: `?category=` filters do not filter. All three URLs render the same 11 products.
- The admin page has a "Đăng nhập Thử nghiệm (Vào thẳng Dashboard)" button that bypasses login. Do not click it casually.

## Design tokens (sampled)

| Token | Value |
|---|---|
| Font | "Be Vietnam Pro", system-ui, -apple-system, sans-serif |
| Page background | #EDF0F5 |
| Primary orange | #EA580C |
| Soft orange surface | #FFF5EB |
| Heading text | #0F172A |
| Primary button | bg #EA580C, text #FFFFFF, radius 16px, 14px / 700, shadow 0 4px 16px rgba(234,88,12,0.35) |
| Secondary button (add to cart) | bg #FFF5EB, text #EA580C, radius 16px, 14px / 700, no shadow |
| Product H1 | 26px / 900 |
| Price | 36px / 900, #EA580C |

Gradients, card radii and section backgrounds were not extracted; use the screenshots of the live site when building.

## Global layout

### Top utility bar
- Left: "Tư vấn ngay: 1900 6789" (tel:19006789), "Cấp cứu Đột quỵ: 115" (tel:115).
- Right: "Đăng nhập Zalo" (https://zalo.me/0933991990), "Tải ứng dụng" (/download-app).

### Header
- Logo: `/assets/logo-tn-orange.png`, with the wordmark "TN STROKE GUARD" beside it.
- Search input, placeholder "Tầm soát đột quỵ miễn phí, dấu hiệu B.E.F.A.S.T, Nattokinase..."
- Cart icon with count badge, linking to /cart.
- Nav links (see Mega nav).

### Mega nav
| Item | Href | Dropdown |
|---|---|---|
| Trang chủ | / | none |
| Tầm soát | /assessment | Test Đột quỵ 10 năm (/assessment/general); Tầm soát Rung nhĩ (/assessment/afib); Thực phẩm bảo vệ (/products?category=supplement); Dấu hiệu B.E.F.A.S.T (/symptoms); Gói khám tầm soát (/products?category=package); Góc sức khỏe Y khoa (/education) |
| B.E.F.A.S.T | /symptoms | none |
| Nhà thuốc | /products | Thực phẩm chức năng mạch não; Gói khám tầm soát đột quỵ; Thuốc dự phòng tim mạch; Chăm sóc sau tai biến (/education?topic=recovery); Trang thiết bị y tế & Máy đo AFib (/products?category=device); Đặt thuốc & Gói khám online (/products) |
| Kết quả tầm soát | /results | none |
| Tra cứu đơn hàng & lịch hẹn | /orders/lookup | none |
| Tải ứng dụng | /download-app | none |
| Giỏ hàng | /cart | count badge |

The dropdown entries are read from the DOM, so their hover and click behaviour is not verified.

### Footer
- Brand block: "TN STROKE GUARD", subtitle "FRAMINGHAM · AHA LE8", tagline "ĐỒNG HÀNH DỰ PHÒNG ĐỘT QUỴ", hotline 19006789 labelled "TỔNG ĐÀI (8:00-22:00)".
- Column "VỀ CHÚNG TÔI": Giới thiệu hệ thống; Hệ thống cơ sở & nhà thuốc; Giấy phép hoạt động y tế; Quy chế hoạt động WebApp; Đội ngũ chuyên môn y khoa; Tin tức & Chiến dịch cộng đồng.
- Column "DANH MỤC": Trung tâm Tầm soát; Góc sức khỏe Tim mạch - Đột quỵ; Đánh giá Đột quỵ Toàn diện 10 năm; Tầm soát Rung nhĩ (AFib); Hồ sơ & Tra cứu Kết quả tầm soát; 6 Dấu hiệu vàng B.E.F.A.S.T; Hướng dẫn sơ cứu Giờ vàng 115.
- Column "TÌM HIỂU THÊM": Chính sách đặt cọc & gói khám (/refund-policy); Chính sách nội dung y khoa; Chính sách đổi trả thuốc 30 ngày (/refund-policy); Chính sách giao nhận dược phẩm (/cart); Chính sách bảo mật dữ liệu (NĐ 13) (/privacy); Chính sách Cookie độc lập (/cookie-policy); Kiểm tra đơn hàng điện tử (/orders/lookup); Điều khoản sử dụng (/terms); Cổng Quản trị Nội bộ (/admin/login).
- Socials: Facebook, Zalo, TikTok, YouTube.
- Bottom: "Chính sách Bảo mật", "Xem Chính sách Cookie chi tiết" (/cookies), and the trademark line "TNMALL / Pharmacy.vn".

### Cookie banner
Buttons: "Tùy chỉnh", "Chỉ cookie thiết yếu", "Chấp nhận tất cả". Banner layout was not inspected visually. The app-wide "Chỉ cookie thiết yếu" choice is the privacy-preserving one.

### Floating elements
Observed: Zalo link, a "Tư vấn" consult button (likely bottom-right), and "Tải ứng dụng". Exact positions not verified.

## Route: `/` (home)

Sections in order:
1. **Hero** — kicker "CHUẨN LÂM SÀNG QUỐC TẾ AHA / ESC 2026". Heading "Chủ động Dự phòng" / "Vững vàng Mạch não". Two CTAs: "ĐÁNH GIÁ NGUY CƠ SỚM" (Kết quả sau 3 phút) and "SÀNG LỌC RUNG NHĨ AFIB" (Thang CHA₂DS₂-VASc). Background images: `images/hero/lc-bg-royal-sakura.jpg`, `lc-bg-meadow.jpg`.
2. **Service tiles** (4 cards, each with a title, subtitle, "→" link):
   - "TẦM SOÁT ĐỘT QUỴ" — "Miễn phí 100%" — "KIỂM TRA NGAY"
   - "DƯỢC PHẨM & TPBVSK" — "Chính hãng kiểm định" — "TẦM SOÁT NGAY"
   - Tile with "Dược sĩ đồng hành"
   - Tile referring to "Theo dõi đều mỗi ngày"
   (Exact tile grouping inferred from text order; verify visually.)
3. **Assessment cards** — "SÀNG LỌC TIM MẠCH & ĐỘT QUỴ" with "Đánh giá Nguy cơ Đột quỵ 10 năm", subtitle "Tích hợp 3 thang đo Quốc tế Framingham · INTERSTROKE · AHA LE8", chips "Miễn phí 100%" and "Không cần đăng ký", CTA "Làm bài đánh giá →". Second card "Bài kiểm tra sàng lọc nguy cơ Đột quỵ do Rung nhĩ (AFib)", CTA "Bắt đầu".
4. **Product promos** — "DƯỢC PHẨM & DINH DƯỠNG MẠCH NÃO" banner (Nattokinase, Ginkgo, Omega-3), chips "Chính hãng 100%" and "Tư vấn Dược sĩ 1:1", CTA "Khám phá ngay →".
5. **"SẢN PHẨM PHÒNG NGỪA ĐỘT QUỴ"** — section with CTA "Khám phá ngay".
6. **Records lookup** — "HỒ SƠ KHÁM & ĐƠN HÀNG", CTA "Tra cứu ngay".
7. **Quick filter chips** — Test Đột quỵ 10 năm; Tầm soát Rung nhĩ; Thực phẩm bảo vệ; Dấu hiệu B.E.F.A.S.T; Gói khám tầm soát; Góc sức khỏe Y khoa; "Xem thể lệ ›".
8. **Flashsale** — heading "FLASHSALE GIÁ TỐT", CTA "XEM NGAY ›". Day tabs: 08:00 - 22:00 27/11 (Đang diễn ra), 28/11 (Sắp diễn ra), 29/11 (Sắp diễn ra). Countdown "Kết thúc sau 06 : 08 : 35" (HH:MM:SS). "Xem tất cả ›" link.
9. **Sản phẩm nổi bật** — product grid (see products list), "Xem tất cả ›".
10. **Danh mục nổi bật** — 4 category tiles with subtitles: Thần kinh não (Tuần hoàn máu não), Tim mạch - Huyết áp (Ổn định nhịp tim), Mỡ máu - Thành mạch (Nattokinase & Omega), Dinh dưỡng dự phòng (Chế độ ăn chuẩn DASH), Phục hồi vận động (Chăm sóc sau tai biến).
11. **B.E.F.A.S.T banner** — "Dấu hiệu B.E.F.A.S.T" / "6 Dấu hiệu vàng cấp cứu" / "Kiểm tra sức khỏe". Card with "Khẩn cấp gọi 115" and "Khám phá phác đồ xử trí" → /symptoms?tab=emergency.
12. **B.E.F.A.S.T cards** — six letters, each with a word, title and description (see data JSON `befast`). Notes: "Thời gian vàng 115".
13. **Video section** — "Video ngắn nổi bật" / "Xem tất cả ›". Eight 9:16-style cards with overlay title and tag ("RADAR SỨC KHỎE" or "2 PHÚT BÁC SĨ"). Items in data JSON `videos`. Button "Xem thêm".
14. **Health library** — "Thư viện video & cẩm nang y khoa", topic chips (Tất cả chuyên đề; Phòng chữa bệnh; Dinh dưỡng; Người cao tuổi; Tim mạch - Huyết áp; Phục hồi sau tai biến; Chương trình tầm soát; Tin tức sức khỏe).
15. **Featured health articles** — "Góc sức khỏe" heading, "Xem tất cả ›" link. Hero card "TN STROKE GUARD · FRAMINGHAM · AHA LE8" / "Vì Trái Tim & Trí Não Việt Nam", kicker "CHỦ ĐỘNG TẦM SOÁT SỚM — KHÔNG CÒN NỖI LO ĐỘT QUỴ", body text about the free 10-year screening, tag "Truyền thông Y khoa". Three smaller cards.
16. **Prevention by age** — "Phòng ngừa theo độ tuổi" / "Phòng ngừa theo mùa & lối sống". Four cards with image, label and 4 bullets each, CTA "Tìm hiểu thêm". Groups: Người trẻ (18–39), Tuổi trung niên (40–59), Người cao tuổi (60+), Trẻ em & thanh thiếu niên.
17. **Footer** — see Global layout.

Interactive: flashsale countdown; day chips; product cards (click → detail); the video cards open videos (not opened).

## Route: `/products`

- Page header breadcrumb: "Trang chủ / Danh sách sản phẩm".
- Left sidebar "Bộ lọc nâng cao" with collapsible filter groups: Giá bán (Dưới 100.000đ; 100.000đ đến 300.000đ; 300.000đ đến 500.000đ; Trên 500.000đ); Loại thuốc (Tất cả; Thuốc kê đơn; Thuốc không kê đơn); Đối tượng sử dụng; Nước sản xuất; Chỉ định; Thương hiệu; Xuất xứ thương hiệu; Thành phần.
- Main: "Danh sách sản phẩm" with sort control "Sắp xếp theo:" (Bán chạy; Giá thấp; Giá cao).
- Notice: "Lưu ý: 100% sản phẩm TPBVSK & Dược phẩm chuẩn GMP Nhật Bản kiểm định rõ ràng — Đặt mua trực tuyến không cần tài khoản, xác thực đơn qua OTP an toàn."
- Grid: 11 product cards (see data JSON `products`).

Card shape: image in a light box (`object-contain`, scale 1.05 on hover), a "-N%" badge, country flag + country, brand line, title, unit, pack size, price, unit price, and a "Chọn mua" button. Cards have no href; clicking opens `/products/<uuid>`.

Behaviour: filters and sort were not interacted with; `?category=` is ignored.

## Route: `/products?category=supplement`, `?category=package`, `?category=device`

Same 11-product grid for all three, so the category filter is not working in the live site. Do not treat the URLs as separate lists in the clone.

## Route: `/products/<uuid>` (example: `/products/b0000000-0000-0000-0000-000000000006`)

Breadcrumb "Trang chủ / Nhà thuốc & Gói khám / Dược phẩm Nhật / <name>".

Sections:
1. **Gallery** — main image plus "Xem thêm 2 ảnh" note. Caveat: "Mẫu mã bao bì sản phẩm có thể thay đổi theo từng lô sản xuất từ nhà máy."
2. **Trust strip** — 3 items: "100% Chính Hãng" (Kiểm định Bộ Y Tế), "Đổi Trả 30 Ngày" (Nếu phát hiện lỗi), "Giao Nhanh 2H" (Nội thành các tỉnh).
3. **Summary** — flag and origin "Nhật Bản · Thương hiệu: Orihiro · Sẵn hàng tại nhà thuốc". Name. "MSP: B0000000 · ★ 5.0 · 98 đánh giá · 42 bình luận". Price 350.000đ / Hộp, original 410.000đ struck through, "-15%" badge, and "Miễn phí vận chuyển toàn quốc".
4. **Options** — "Quy cách" (Hộp 3 Vỉ x 10 Viên), "Đơn vị tính" (Hộp / Vỉ / Viên).
5. **Quantity** — "−" / count / "+" (default 1).
6. **CTAs** — "+ Thêm vào giỏ hàng" (secondary, orange on #FFF5EB) and "Chọn mua ngay" (primary orange with shadow).
7. **Thông tin chuyên môn** — expertise paragraphs and "Công dụng & quyền lợi nổi bật" bullets.
8. **Hỗ trợ chuyên gia y tế** — pharmacist hotline 1900 1234 (24/7). Card with "Tổng đài Dược sĩ tư vấn miễn phí".
9. **Chính sách giao hàng & bảo quản** — 3 checkmark bullets.
10. **Sản phẩm cùng chuyên khoa Tim mạch & Đột quỵ** — 4 related products with "Xem tất cả >".

Behaviour: adding to cart works without login and shows a count of 1 in the cart badge. Ingredients and usage sections are absent on this product.

## Route: `/cart`

- Empty state: "Giỏ hàng của bạn (0 sản phẩm)", "← Tiếp tục chọn sản phẩm", "Giỏ hàng đang trống", copy "Khám phá các thực phẩm bảo vệ thành mạch, hoạt huyết não hoặc gói khám tầm soát đột quỵ chính hãng.", CTA "Khám phá Nhà thuốc & Gói khám →".
- Filled state (1 item tested): banner "Mua thêm 150.000đ để được Miễn phí giao hàng tận nhà.", "Xóa tất cả" link; row with category tag "Dược phẩm Nhật · Hộp", name, price, struck original, quantity "− 1 +", line total, and "Xóa".
- Summary card: "Tóm tắt đơn hàng", Tạm tính (1 sản phẩm) 350.000đ, Phí vận chuyển dự kiến 30.000đ, Thành tiền 380.000đ.
- Primary button "Tiến hành đặt hàng (Xác thực OTP) →".
- Footnote: "Phiên giỏ hàng ẩn danh không cần tạo tài khoản. Bằng việc tiến hành đặt hàng, bạn đồng ý với Điều khoản và Chính sách hoàn tiền (đổi trả 30 ngày)."

Checkout form fields: not captured (see Coverage). Based on the cart copy, the flow is: anonymous cart, then OTP verification by phone. Describe the fields from the live checkout with the other agent or from a test account if needed.

Toasts were not observed on add-to-cart.

## Route: `/assessment`

- Title "Tầm soát Nguy cơ Đột quỵ", prompt "Bạn muốn thực hiện bài kiểm tra tầm soát nào?".
- Two selectable cards:
  - "Đánh giá Nguy cơ Đột quỵ Toàn diện": "Đánh giá tổng quát nguy cơ đột quỵ 10 năm qua chỉ số huyết áp, bệnh nền và lối sống (Framingham · INTERSTROKE · AHA LE8)."
  - "Tầm soát Rung nhĩ & Huyết khối (AFib)": "Dành cho người có rối loạn nhịp tim, hồi hộp hoặc rung nhĩ; đánh giá nguy cơ huyết khối theo thang CHA₂DS₂-VASc."
- Link "Huỷ".

## Route: `/assessment/general`

- Code "PH-02.1 · Sàng lọc Tổng quát". Title "Đánh giá Nguy cơ Đột quỵ Toàn diện". Subtitle as above.
- Back link "← Chọn bài tầm soát khác".
- Stepper: 1 "Hồ sơ hành chính" → 2 "Câu hỏi lâm sàng & lối sống".
- Step 1 form:
  - "Họ và tên người tầm soát *" — text, placeholder "Ví dụ: Nguyễn Văn An"
  - "Số điện thoại liên hệ *" — text, placeholder "0901 234 567"
  - "Năm sinh *" — text, placeholder "Ví dụ: 1965"
  - "Giới tính sinh học *" — two toggle cards: "Nam giới" (Hệ số chuẩn nam) and "Nữ giới" (Hệ số chuẩn nữ)
  - Consent checkbox "Tôi xác nhận đã đọc, hiểu và đồng ý với Điều khoản sử dụng và Chính sách bảo mật dữ liệu y tế của TNStrokeGuard. *"
  - Primary button "Tiếp tục vào câu hỏi sàng lọc →"
- Privacy note: "Mục đích thu thập & Bảo mật thông tin (Nghị định 13/2023/NĐ-CP)".
- Bottom "3 THANG ĐIỂM ĐƯỢC TÍNH TỰ ĐỘNG": Framingham Stroke Risk (2017), AHA Life's Essential 8 (2022), INTERSTROKE Lifestyle Index.
- Disclaimer box (ℹ️): "Đây là công cụ sàng lọc tham khảo dựa trên hướng dẫn lâm sàng quốc tế, không thay thế cho chẩn đoán trực tiếp của bác sĩ chuyên khoa."
- Cross-link "Bạn đã được chẩn đoán Rung nhĩ? … Chuyển sang Tầm soát Rung nhĩ →".

**Step 2 questions and result bands: NOT CAPTURED.** Scoring is described only at the level of the three frameworks. The `assessmentGeneral.questions` array in the data file is empty for this reason.

## Route: `/assessment/afib`

- Code "PH-02.2 · Chuyên khoa Tim mạch". Title "Tầm soát Huyết khối Rung nhĩ (CHA₂DS₂-VASc)". Subtitle "5 câu hỏi bệnh sử kết hợp tự động tính điểm Tuổi & Giới tính theo khuyến cáo ESC".
- Stepper: 1 "Hồ sơ hành chính (Tuổi & Giới)" → 2 "5 câu hỏi bệnh sử CHA₂DS₂-VASc".
- Step 1: same fields as the general form.
- Score panel "CẤU TRÚC ĐIỂM CHA₂DS₂-VASC (0 – 9)":
  - C Suy tim sung huyết +1
  - H Tăng huyết áp +1
  - A₂ Tuổi ≥ 75 (tự tính) +2
  - D Đái tháo đường +1
  - S₂ Tiền sử Đột quỵ / TIA +2
  - V Bệnh mạch máu +1
  - A / Sc Tuổi 65–74 / Giới nữ +1
- Disclaimer: "Thang điểm CHA₂DS₂-VASc dùng để ước tính nguy cơ đột quỵ ở người rung nhĩ. Tuyệt đối không tự ý dùng hoặc ngưng thuốc chống đông khi chưa có chỉ định bác sĩ."
- Cross-link "Muốn đánh giá cả lối sống & mỡ máu? → Làm thêm Bài Đánh giá Toàn diện →".

The 5 history questions are not captured (same gating as general).

## Route: `/results`

- Code "PH-02.3 · Hồ sơ & Tra cứu Báo cáo". Title "Tra Cứu & Lịch Sử Phiên Tầm Soát".
- Copy: "Dữ liệu phiên được lưu tạm thời bảo mật trên trình duyệt của bạn."
- Lookup: input for Session ID or share link, button "Mở báo cáo →".
- Session list header "Kết quả thực hiện trong phiên này (0)", empty state "Chưa có bài đánh giá nào trong phiên hiện tại" with CTA "Làm Bài Test Toàn diện". Quick add chips: "+ Đánh giá Toàn diện", "+ Tầm soát Rung nhĩ".

Result report (after an assessment) not reachable without completing an assessment.

## Route: `/symptoms`

- Code "PHÂN HỆ PH-03 · NHẬN DIỆN & CẤP CỨU ĐỘT QUỴ CẤP". Title "Nhận biết B.E.F.A.S.T & Phác đồ Xử trí Giờ vàng".
- Intro: "Mỗi phút trôi qua khi đột quỵ làm tổn thương gần 1,9 triệu tế bào thần kinh. Đưa người bệnh tới bệnh viện có đơn vị đột quỵ trong 'Giờ vàng' (3 – 4,5 giờ đầu)."
- Buttons: "GỌI CẤP CỨU 115"; tab switch "1. 6 Dấu hiệu Vàng B.E.F.A.S.T" and "2. Xử trí Giờ vàng & Sai lầm cần tránh".
- Six letter cards (B, E, F, A, S, T): large letter, English word, Vietnamese title, description, "Cách kiểm tra nhanh" callout, and a toggle "Nhấn để đánh dấu nếu gặp biểu hiện này". Clicking toggles a checked state (not tested).
- Footer CTA "Chưa có triệu chứng cấp tính nhưng muốn kiểm tra nguy cơ dự phòng? … Làm bài tầm soát phòng ngừa →".

## Route: `/symptoms?tab=emergency`

- Same header with tab 2 active.
- Section "KHUYẾN CÁO BỘ Y TẾ · 5 Việc CẦN LÀM NGAY trong lúc chờ 115": numbered list 1–5 (see data JSON `emergencyTab.actions`).
- Section "LƯU Ý AN TOÀN NGƯỜI BỆNH · 4 Sai lầm TUYỆT ĐỐI KHÔNG LÀM tại nhà": four ✕ items (see data JSON `emergencyTab.doNots`).
- Same CTA footer.

## Route: `/education`

- Code "Phân hệ PH-05 · Góc Sức khỏe Tim mạch – Đột quỵ". Title "Cẩm Nang Y Khoa Phòng Ngừa Đột Quỵ". Subtitle "Nội dung biên soạn dễ hiểu dành cho người trung niên, cao tuổi và gia đình chăm sóc."
- Topic chips: Tất cả chuyên đề; Tổng quan & Phân loại; Kiểm soát Bệnh nền; Dinh dưỡng & Lối sống; Phục hồi Sau Đột quỵ.
- Article grid (6 cards): topic tag, read time ("4 phút đọc" to "6 phút đọc"), title, excerpt, reviewer line "Tham vấn: ...", "Đọc chi tiết →". Items in data JSON `articles`.

## Route: `/education/<slug>`

Example: `/education/kiem-soat-tang-huyet-ap-yeu-to-nguy-co-so-1`

- Back link "← Quay lại chuyên mục Kiểm soát Bệnh nền".
- Reviewer badge "✓ Kiểm duyệt: Chuyên khoa Nội Tim mạch", updated "08/06/2026 · 4 phút đọc".
- Title and lede.
- Box "TÓM TẮT Y KHOA QUAN TRỌNG" with 3 numbered points.
- Body sections "1. Cơ chế huyết áp cao gây tắc và vỡ mạch não" and "2. Quy tắc đo huyết áp chuẩn tại nhà cho người trên 50 tuổi".
- CTA card "Kiểm tra ngay mức nguy cơ đột quỵ cá nhân của bạn" → "Làm bài đánh giá ngay →".
- "Bài viết cùng chuyên khoa" with three related cards.

## Route: `/orders/lookup`

- Code "PH-04.6 · Tra cứu Đơn hàng". Title "Kiểm Tra Trạng Thái Đơn Hàng".
- Input for order code (example TNSG-123456) or phone. Empty state "Chưa tìm thấy đơn hàng nào khớp thông tin".
- Helper "Nếu bạn vừa đặt mua qua tổng đài Zalo OA, dược sĩ sẽ gửi mã vận đơn trực tiếp tới số điện thoại của bạn." CTA "Đến Nhà thuốc & Gói khám →".

Lookup submit was not tested (it would send a query with personal data).

## Route: `/download-app`

- Code "PHÂN HỆ PH-06 · HỆ SINH THÁI DI ĐỘNG". Title "Ứng dụng Chăm sóc Sức khỏe Chủ động TN Mall".
- Store badges "DOWNLOAD ON THE App Store" and "GET IT ON Google Play".
- Member perks card "Đặc quyền Thành viên App": three checkmarks.
- Feature cards: Theo dõi Chỉ số Sinh học; Mua sắm Dược phẩm Chính hãng; Tích điểm Đổi Gói khám.

## Route: `/terms`

- Header "Quy chế hoạt động & Trách nhiệm pháp lý", title "Điều Khoản Sử Dụng".
- Clinical disclaimer box with 3 numbered items (not a diagnosis, emergency 115 instruction).
- Five numbered sections: 1 Phạm vi cung cấp dịch vụ; 2 Minh bạch thông tin (no "số 1" claims, no fake reviews); 3 Xác thực đơn hàng qua OTP; 4 Sở hữu trí tuệ; 5 Luật điều chỉnh.
- "Xem thêm" links: Chính sách bảo mật; Chính sách Cookie; Chính sách hoàn tiền.

## Route: `/admin/login` (described only, not submitted)

- Centred card, "CỔNG QUẢN TRỊ NỘI BỘ", brand "TNStrokeGuard Admin".
- Fields: "Tài khoản / Email quản trị", "Mật khẩu".
- Buttons: "Đăng nhập Quản trị →" (primary) and "⚡ Đăng nhập Thử nghiệm (Vào thẳng Dashboard)" (bypass).
- Back link "← Quay về Giao diện Người dùng (Guest WebApp)".

## Routes not in the brief

`/privacy`, `/cookie-policy`, `/refund-policy` and `/cookies` appear as links. They were not visited.
