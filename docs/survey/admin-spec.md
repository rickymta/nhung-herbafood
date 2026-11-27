# TN AFFILIATE OS - Admin UI spec

Nguồn: https://tn-affiliate-os.vercel.app/ (hash routes, dữ liệu demo). Khảo sát chỉ đọc, không submit thao tác nào.
Ghi chú: mọi icon là SVG stroke (viewBox 24, stroke-width 1.8, round cap/join). Lucide tương đương được ghi bên cạnh.

---

## 1. Global layout

### 1.1 Khung
- Body nền `#f2f5f8`, chữ `#0f172a`, font **Be Vietnam Pro**, fallback `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Bố cục 2 cột: sidebar cố định bên trái (`aside.side`, rộng **252px**) + vùng nội dung (`main`, padding `22px 24px 40px`, không có max-width).
- Topbar `header.top`: cao **67px**, nền `rgba(255,255,255,.9)` (glass), viền dưới `1px solid #e8edf2`, dính trên cùng khi cuộn.

### 1.2 Sidebar
- Nền: `linear-gradient(170deg, #0b2f36 0%, #0d3d42 55%, #0d4a4c 100%)` (token `--side1 #0b2f36`, `--side2 #0d4a4c`). Đọc được là `rgb(11,47,54) -> rgb(12,61,66) -> rgb(13,74,76)`.
- Padding `22px 16px`. Chữ mặc định `#e2eeec`.
- **Logo** (`div.logo`): ô vuông bo góc chứa chữ "T" + "N" (N in đậm, `<b>`); bên cạnh chữ **TN AFFILIATE OS**. Ô logo có nền xanh lá (brand `#0f9d74` -> `#0b7d5e`).
- **Menu** (`nav.nav`), icon 22x22, khoảng cách dọc giữa các item:

| # | Nhãn | Icon mô tả | Lucide gần nhất |
|---|---|---|---|
| 1 | Tổng quan | Mái nhà có cửa | `house` |
| 2 | Đối tác | Hai người (người chính + người phía sau) | `users` |
| 3 | Khách hàng | Một người (đầu tròn + vai) | `user-round` |
| 4 | Đơn hàng | Giỏ hàng có 2 bánh | `shopping-cart` |
| 5 | Hoa hồng & Đối soát | Cơ sở dữ liệu (ellipse chồng) | `database` |
| 6 | Thanh toán | Thẻ tín dụng (chữ nhật + dải ngang) | `credit-card` |
| 7 | Chiến dịch | Loa phát thanh (megaphone) | `megaphone` |
| 8 | Sản phẩm | Hộp 3D | `package` |
| 9 | Báo cáo | Biểu đồ cột (3 cột + trục) | `chart-no-axes-column` (cũ: `bar-chart-3`) |
| 10 | Đào tạo | Mũ tốt nghiệp | `graduation-cap` |
| 11 | Tích hợp TN MALL | Hai mắt xích | `link` |
| 12 | Cài đặt | Bánh răng | `settings` |

- Trạng thái item:
  - Thường: nền trong suốt, chữ `#e2eeec`, weight 400, font 15.5px.
  - Đang chọn (`.on`): chữ trắng, weight 600, nền gradient xanh lá, bo `10px`, bóng `0 6px 16px rgba(16,185,129,.3)`.
  - Padding item `11px 14px`, radius `10px`.
- Khi đang ở một nhóm có submenu (ví dụ "Đối tác"), item được mở rộng ra 3 subitem (xem mục Partners): "Danh sách đối tác", "Hồ sơ đăng ký", "Cấp bậc & chính sách". Hiện tại chỉ thấy menu mở khi ở trang Đối tác.
- **Footer sidebar** (`div.side-foot`), chữ nhỏ, màu mờ, 2 dòng:
  - `Phiên bản demo S1 · Dữ liệu giả lập`
  - `EBISU KAZE JAPAN · TN MALL`

### 1.3 Topbar (trái -> phải)
1. Nút menu (mobile): icon `layers` (hình 3 lớp).
2. **Ô tìm kiếm** (`label.gsearch`): icon `search` bên trái; placeholder `Tìm kiếm đối tác, khách hàng, đơn hàng, chiến dịch...`; badge phím tắt bên phải **`Ctrl + K`** (ô nhỏ viền mờ). Ctrl+K focus vào ô tìm kiếm (không thấy palette rõ ràng khi thử; ghi nhận là chưa xác minh đầy đủ).
3. Spacer (đẩy phần còn lại sang phải).
4. Pill **`DỮ LIỆU DEMO`** (tooltip: "Toàn bộ số liệu là dữ liệu giả lập").
5. Nút chuông (`button.bell`): icon `bell`, badge số đỏ **12** góc trên-phải. Bấm mở modal **Thông báo (demo)**: 
   - "12 đối tác có hoa hồng > 50 triệu cần soát xét"
   - "287 đơn hàng chờ xác minh quá 24 giờ"
   - "3 đối tác có dấu hiệu bất thường"
   - Chiến dịch "Sale Tết 2025" còn 2 ngày
   - "60 hồ sơ đăng ký mới"
   - Nút: `Đóng`
6. Vách ngăn dọc (`.vsep`).
7. **Menu người dùng** (`button.who`): avatar tròn chữ **TN** (nền xanh lá), tên **CEO Triệu Nhung**, chevron `chevron-down`. Bấm mở dropdown:
   - Header nhỏ: `TÀI KHOẢN DEMO — VÀO NGAY, KHÔNG CẦN MẬT KHẨU`
   - Danh sách vai trò để chuyển đổi (mỗi dòng: avatar 2 chữ + tên + vai trò):
     - TN - CEO Triệu Nhung - CEO
     - HM - Trần Hoàng Minh - Kế toán
     - QA - Nguyễn Quỳnh Anh - Kế toán
     - QB - Trần Quốc Bảo - Vận hành đối tác
     - TH - Lê Thu Hà - Quản lý chính sách
     - MA - Nguyễn Thị Mai Anh - Đối tác (cổng đối tác)
   - Mục cuối: `Cài đặt & nhật ký kiểm toán` (link tới #/settings)

### 1.4 Design tokens
| Token | Giá trị |
|---|---|
| `--bg` | `#f2f5f8` (nền trang) |
| `--card` | `#ffffff` |
| `--text` | `#0f172a` |
| `--muted` | `#64748b` (phụ đề, nhãn) |
| `--muted2` | `#94a3b8` |
| `--line` | `#e8edf2` (viền card, viền input) |
| `--line2` | `#f1f4f7` (ngăn dòng bảng) |
| `--brand` | `#0f9d74` (primary green) |
| `--brand-d` | `#0b7d5e` (hover/đậm) |
| `--brand-l` | `#e7f7f1` (nền nhạt brand) |
| `--teal` | `#0f8f86` |
| `--side1` | `#0b2f36` |
| `--side2` | `#0d4a4c` |
| `--blue` | `#3b82f6` |
| `--purple` | `#8b5cf6` |
| `--amber` | `#f59e0b` |
| `--orange` | `#f97316` |
| `--red` | `#ef4444` |
| `--radius` | `14px` (card) |
| `--shadow` | `0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)` |

- **Card**: nền trắng, viền `1px solid #edf1f5`, radius **14px**, bóng: `0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)`. Padding `16px 18px 0` (card KPI). Card có thể có accent (`t-green`).
- **Primary button** (`Thêm đối tác`, `Tạo đợt chi`...): chữ trắng 15px/600, padding `12px 18px`, radius **10px**, bóng `0 4px 12px rgba(15,157,116,.25)`, nền gradient xanh lá (brand).
- **Secondary button** (`Xuất Excel`, `Hủy`): nền trắng, viền `1px solid #e8edf2`, chữ `#0f172a` 15px/600, radius 10px, padding `12px 18px`.
- **Icon button** (hàng bảng: Xem / Sửa / ...): ô vuông nhỏ, icon 17px; các hành động là `eye` (Xem), `pencil` (Sửa), `more-horizontal` (... menu).
- **Input / select**: viền `#e8edf2`, radius ~10px, nền trắng.
- **Tiêu đề trang** (`h1`): 30px / weight 800 / `#0f172a`.
- **Phụ đề trang** (`p`): 16px / 400 / `#64748b`.
- **Bảng**:
  - Header `th`: nền `#f8fafc`, chữ `#334155` 13px/600, padding `11px 10px`.
  - Cell `td`: 13.5px/400, padding `9px 10px`, ngăn dòng `#f1f4f7`.
  - Số tiền căn phải, tabular.
  - Có icon sort ⇅ bên cạnh các cột sortable.
- **Status badge (pill)**: padding `3px 10px`, radius **99px**, 12px / 600. Bảng màu xem bên dưới.
- **Chip/tag bo 6px** (trạng thái đơn, thanh toán): padding tương tự, radius **6px**.

#### Bảng màu badge (nền / chữ)
| Nhãn | Nền | Chữ | Kiểu |
|---|---|---|---|
| Đang hoạt động / Đã thanh toán / Hoàn thành / Thành công / Đang chạy (đối tác-chiến dịch) / Tái mua tốt / Đã khóa-tag | `#dcfce7` | `#15803d` | pill/6px |
| Affiliate (loại) | `#dcfce7` | `#15803d` | pill |
| CTV (loại) | `#dbeafe` | `#1d4ed8` | pill |
| Đại lý (loại) | `#ede9fe` | `#6d28d9` | pill |
| Đang giao / Đã đồng bộ (xanh dương) | `#dbeafe` | `#1d4ed8` | 6px |
| Chờ xác minh / Chờ lấy hàng / Chờ xác nhận | `#ffedd5` | `#c2410c` | 6px |
| Lỗi / Lỗi đồng bộ | `#fee2e2` | `#b91c1c` | 6px |
| Bắt buộc (training) | `#fee2e2` | `#b91c1c` | pill |
| Tự chọn (training) | `#f1f5f9` | `#475569` | pill |
| Chỉ có text (không nền): Chờ duyệt, Tạm dừng, Đang mở, Đã đóng | trong suốt | `#0f172a` | - |
| Chờ duyệt / Tạm giữ / Đã duyệt (trong bảng hoa hồng) | - | - | xem ghi chú |

Ghi chú: Các trạng thái "Chờ duyệt", "Tạm dừng" trong bảng đối tác hiển thị dạng text. Màu cụ thể của pill "Chờ duyệt" (hoa hồng, đối tác) chưa đo được đầy đủ (không thấy nền rõ); khi làm UI nên dùng cam/vàng (`#ffedd5`/`#c2410c`) cho "Chờ duyệt" và xám (`#f1f5f9`/`#475569`) cho "Tạm dừng" để nhất quán.
Cấp bậc (tier) hiển thị là chip có màu riêng: Bronze, Silver, Gold, Sapphire (chưa đo màu chính xác).
Chart/status còn lại: Đang chạy (blue/pill) - Sắp diễn ra - Đã kết thúc: pill trắng viền.

#### Màu biểu đồ
- GMV / series chính: xanh lá `#10b981` (gradient area: stop 0 `#10b981` opacity .35 -> 0).
- Đơn hàng: cột xanh dương (`#3b82f6`) — tương ứng legend "Đơn hàng hợp lệ".
- Donut nguồn GMV: 4 phần (Đối tác Affiliate 58,4%; TN MALL Direct 24,7%; Chiến dịch đặc biệt 11,3%; Khác 5,6%). Màu từng phần chưa đo chính xác — chọn bảng: `#0f9d74`, `#3b82f6`, `#f59e0b`, `#94a3b8`.
- Sparkline KPI: đường `#10b981`-ish, area gradient 35% -> 0.
- Trục X: nhãn ngày `01/01`, `03/01`, ... cách 2 ngày (chỉ hiển thị số lẻ), 15 điểm dữ liệu.
- Trục Y trái: "Doanh số (tỷ đ)" 0,0 -> 2,0 (bước 0,4). Trục Y phải: "Đơn hàng" 0 -> 2.500 (bước 500).
- Legend: chấm tròn màu + nhãn, nằm dưới/trên card.

### 1.5 Typography (tóm tắt)
| Dùng cho | Size | Weight | Màu |
|---|---|---|---|
| H1 trang | 30px | 800 | `#0f172a` |
| Phụ đề trang | 16px | 400 | `#64748b` |
| Nhãn card KPI | ~14px | 600 | `#475569` |
| Giá trị KPI | ~28-30px | 800 | `#0f172a` (số tiền dài ~24px) |
| Delta | 13px | 600 | `#15803d` (tăng), `#b91c1c` (giảm) |
| Nút | 15px | 600 | - |
| Th | 13px | 600 | `#334155` |
| Td | 13.5px | 400 | `#0f172a` |
| Nav | 15.5px | 400/600 | - |
| Badge | 12px | 600 | - |

### 1.6 Quy ước số & ngôn ngữ
- Số: dấu chấm phân nghìn, dấu phẩy thập phân (`12.850.000.000 ₫`, `4,28%`).
- Tiền: `₫` đặt sau số, cách 1 khoảng trắng.
- Ngày: `dd/mm/yyyy`; giờ `HH:mm`.
- Delta: `▲ +24,6%` (xanh) / `▼ -12,9%` (đỏ), kèm `so với 30 ngày trước`.
- Mọi KPI card có icon tooltip `ⓘ` (title "Số liệu tổng hợp DEMO — không phải kết quả thực tế").

---

## 2. Routes

Chung cho mỗi trang: `ph` (header): H1 + phụ đề bên trái; bên phải: date range button + các nút hành động.
Date range button (chung): icon `calendar`, nhãn `30 ngày gần nhất` + `chevron-down`; cạnh là text khoảng ngày `01/01/2025 – 30/01/2025`.

### 2.1 Tổng quan (`#/`)
- **H1**: Tổng quan điều hành
- **Phụ đề**: Hiệu quả chương trình Affiliate toàn hệ thống
- **Toolbar**: date range (30 ngày gần nhất / 01/01/2025 – 30/01/2025).
- **KPI (grid 5 cột, card có sparkline dưới)**:
  1. Doanh số GMV — `12.850.000.000 ₫` — ▲ +24,6% (icon `shopping-bag`/`briefcase` - box có khóa)
  2. Đối tác hoạt động — `3.482` — ▲ +12,8%
  3. Hoa hồng phải trả — `1.927.500.000 ₫` — ▲ +22,1%
  4. Đơn hàng hợp lệ — `28.764` — ▲ +18,9%
  5. Tỷ lệ tái mua — `36,9%` — ▲ +4,2 điểm %
  - Mỗi card: nhãn + icon hộp góc trái; giá trị; delta; "so với 30 ngày trước"; sparkline area.
- **Chart chính**: "Doanh số & Đơn hàng theo thời gian"
  - Toggle: `Theo ngày` | `Theo tuần` (segmented, mặc định Theo ngày). Icon chọn `Theo ngày`.
  - Combo chart: line/area GMV (trục trái, tỷ đ) + cột Đơn hàng (trục phải). Legend: "Doanh số (GMV)", "Đơn hàng hợp lệ".
  - X: 01/01 đến 29/01 (dữ liệu tới 29/01; khoảng chọn 01/01–30/01).
- **Donut "Nguồn doanh số (GMV)"**: tâm `12,85 Tỷ ₫`. Legend 4 dòng: Đối tác Affiliate `7.506.400.000 ₫` 58,4%; TN MALL (Direct) `3.175.600.000 ₫` 24,7%; Chiến dịch đặc biệt `1.452.000.000 ₫` 11,3%; Khác `716.000.000 ₫` 5,6%.
- **Bảng "Top 5 Đối tác có doanh số cao nhất"** (link `Xem tất cả` -> #/partners):
  - Cột: `#` | `Đối tác` (avatar 2 chữ + tên + @handle) | `Doanh số (GMV)` | `Đơn hàng` | `Hoa hồng dự kiến`
  - Dữ liệu: xem admin-data.json.
- **Card "Cảnh báo cần xử lý"** (link `Xem tất cả`): 4 dòng nổi bật:
  - "12 đối tác có hoa hồng > 50 triệu" — "Cần soát xét & phê duyệt thanh toán"
  - "287 đơn hàng chờ xác minh" — "Đã quá 24 giờ, cần xử lý"
  - "3 đối tác có dấu hiệu bất thường" — "Đơn hàng tăng đột biến (>300%)"
  - "1 chiến dịch sắp kết thúc" — "Sale Tết 2025" – còn 2 ngày
- **Card "Tổng quan nhanh"**: 3 dòng nhỏ với mũi tên delta:
  - Đối tác `4.218` ▲ +11,9%
  - Khách hàng `186.420` ▲ +20,3%
  - Chiến dịch `12` ▲ +50,0%
- **Footer strip** (cuối trang): `82 hồ sơ đăng ký chờ xử lý · Chính sách áp dụng: v1.3`

### 2.2 Đối tác (`#/partners`)
- **H1**: Quản lý đối tác Affiliate
- **Phụ đề**: Danh sách đối tác, trạng thái hoạt động và hiệu suất bán hàng
- **Header actions**: `Xuất Excel` (secondary, icon download) | `Thêm đối tác` (primary, icon plus)
- **Filter bar** (chip/select groups):
  - Cấp bậc: `Bronze` `Silver` `Gold` `Sapphire`
  - Trạng thái: `Đang hoạt động` `Chờ duyệt` `Tạm dừng`
  - Nguồn: `TN MALL` `Facebook` `TikTok` `Website` `YouTube` `Zalo`
  - Khu vực: `Miền Bắc` `Miền Nam` `Miền Trung` `Tây Nguyên`
  - Date range: `01/01/2025 – 30/01/2025`
- **KPI (4 card)**: Tổng đối tác `4.218` ▲+11,9%; Đang hoạt động `3.482` ▲+12,8%; Chờ duyệt `126` ▲+5,9%; Tạm dừng `54` ▼-12,9%.
- **Bảng chính** (12 cột):
  `#` | `Mã đối tác` | `Họ và tên` (tên + email) | `Loại` | `Cấp bậc` | `Nguồn` | `Doanh số ⇅` | `Hoa hồng ⇅` | `Đơn hàng ⇅` | `Ngày đăng ký ⇅` | `Trạng thái ⇅` | `Thao tác`
  - Mã đối tác: AFF001286 / CTV000972 / DL000358 ... (prefix AFF/CTV/DL theo loại)
  - Loại: Affiliate | CTV | Đại lý
  - Cấp bậc: pill màu (xem bảng màu tier)
  - Nguồn: text (TN MALL, Facebook, TikTok, Website, YouTube, Zalo)
  - Trạng thái: Đang hoạt động (pill xanh) | Chờ duyệt (text) | Tạm dừng (text)
  - Thao tác: icon `eye` (Xem -> chi tiết đối tác), `pencil` (Sửa, mở modal), `more` (...)
  - Hàng bấm vào -> chuyển sang `#/partners/{mã}`.
- **Pagination**: "Hiển thị 1 – 8 trên 59 đối tác (mẫu demo)" + nút số trang `1 2 3 4 5 … 8` (trang đang chọn nền xanh).
- **Card "Top nguồn kênh mang lại đối tác cao nhất"** (link `Xem chi tiết`): bảng `# | Nguồn | Số đối tác | Tỷ lệ`.
- **Card "Phân bổ đối tác theo khu vực"** (`Xem chi tiết`): tổng `4.218 Đối tác` + phân bổ 5 vùng (Miền Bắc, Miền Nam, Miền Trung, Tây Nguyên, Khác) dạng thanh/donut.
- **Card "Tác vụ nhanh"**: 4 link:
  - `Duyệt đối tác chờ xử lý (126)`
  - `Quản lý đối tác tạm dừng (54)`
  - `Phân cấp / nâng cấp đối tác`
  - `Mời đối tác mới`

#### Modal "Thêm đối tác"
- Tiêu đề: `Thêm đối tác`
- Banner note: "Đối tác mới ở trạng thái Chờ duyệt, cấp Bronze. Không nhập giấy tờ/tài khoản ngân hàng thật vào bản demo."
- Fields:
  - `Họ và tên *` (text)
  - `Email *` (email)
  - `Loại` (select: Affiliate [mặc định] | CTV | Đại lý)
  - `Nguồn` (select: Website [mặc định] | Facebook | TikTok | TN MALL | YouTube | Zalo)
  - `Khu vực` (select: Miền Bắc [mặc định] | Miền Nam | Miền Trung | Tây Nguyên)
  - `Tỉnh/TP` (text, mặc định "Hà Nội")
- Footer: `Hủy` (secondary) | `Tạo đối tác` (primary)

#### Trang chi tiết đối tác (`#/partners/AFF001286`)
- Breadcrumb/back + H1: `Chi tiết hồ sơ đối tác`; phụ đề: `Thông tin định danh, hiệu suất, khách hàng và lịch sử giao dịch`
- Header card: `AFF001286 – Nguyễn Thị Mai Anh`, pill cấp bậc `Sapphire`, pill `Đang hoạt động`.
- Actions: `Chỉnh sửa hồ sơ` (secondary), `Khóa tạm thời` (secondary/đỏ), `Gửi thông báo` (secondary).
- Thông tin (grid): Số điện thoại `0972.•••.448` (che số), Email, Khu vực `Hà Nội`, Ngày đăng ký `15/12/2024`, Người phụ trách `Trần Quốc Bảo`, Kênh nguồn `TN MALL`.
- **Tabs** (6): `Tổng quan` (mặc định) | `Khách hàng` | `Đơn hàng` | `Hoa hồng` | `Tài liệu` | `Nhật ký`.
- Tab **Tổng quan**:
  - KPI 4 card: GMV `1.256.400.000 ₫` ▲+24,6%; Đơn hàng `2.986` ▲+12,8%; Hoa hồng ước tính `188.460.000 ₫` ▲+22,1%; Tỷ lệ chuyển đổi `4,61%` ▲+0,6 điểm %.
  - Chart "Xu hướng doanh số (GMV) — 30 ngày gần nhất" (combo như dashboard).
  - Donut "Nguồn khách hàng" tổng `5.872` (TN MALL Direct 50,0% | Chiến dịch 21,6% | Đối tác giới thiệu 17,0% | Khác 11,4%).
  - Bảng "Danh sách khách hàng gần đây": `# | Khách hàng | Số điện thoại | Đơn hàng | Doanh số (GMV) | Ngày phát sinh`.
  - Card "Thông tin ngân hàng": Ngân hàng Vietcombank (VCB), Số tài khoản (che, DEMO), Chủ tài khoản, Chi nhánh.
  - Card "Thông tin thuế": Mã số thuế (DEMO), Loại hình Cá nhân, Ngày cấp, Cơ quan cấp; dòng cảnh báo "Quy tắc khấu trừ thuế TNCN: chờ kế toán ký duyệt (DEC)."
  - Card "Mã giới thiệu liên kết": `AFF001286` + link `https://tnmall.vn/ref/AFF001286`.
  - "Hoạt động gần đây" (timeline, link Xem tất cả): mỗi item có tiêu đề, mô tả, thời gian.
- Tab **Khách hàng**: "5 khách hàng được ghi nhận (mẫu demo). Ghi nhận khách ≠ quyền hưởng hoa hồng vô hạn." Bảng khách hàng (`#`, Khách hàng, Mã KH, SĐT, Đơn hàng, GMV, Ngày).
- Tab **Đơn hàng**: bảng `Mã đơn | Khách hàng | Sản phẩm | Giá trị | Thanh toán | Giao hàng | Thời gian` (5 dòng mẫu, Giao hàng dạng mã `SHIPPING`/`DONE` trong nguồn, hiển thị tiếng Việt).
- Tab **Hoa hồng**: 
  - Khối "Sổ hoa hồng (ledger bất biến)" — `Số dư: 652.500 ₫`.
  - Ghi chú: "Bút toán chỉ được thêm (accrual / reversal / payout). Không có thao tác sửa hoặc xóa bút toán từ giao diện."
  - Bảng: `Thời gian | Loại | Đơn | Diễn giải | Chính sách | Số tiền` (Loại = ACCRUAL, REVERSAL, PAYOUT).
- Tab **Tài liệu**: "Giấy tờ định danh lưu ở kho tệp mã hóa (chưa triển khai — placeholder). Bản demo không lưu giấy tờ thật." Danh sách file: `Hợp đồng đối tác (mẫu).pdf` 482 KB DEMO; `Phụ lục chính sách v1.3.pdf` 210 KB DEMO.
- Tab **Nhật ký** (audit): `Thời gian | Người thực hiện | Hành động | Đối tượng | Chi tiết`; mẫu: "Cập nhật thông tin tài khoản ngân hàng (giá trị đã che)" — Trần Quốc Bảo · `partner.bank.update` — 27/01/2025 14:05.

### 2.3 Khách hàng (`#/customers`)
- **H1**: Khách hàng được giới thiệu
- **Phụ đề**: Theo dõi khách hàng, trạng thái chuyển đổi và tái mua
- **Toolbar**: date range `30 ngày gần nhất` | `01/01/2025 – 30/01/2025`.
- **KPI (4 card)**: Tổng khách hàng được ghi nhận `186.420` ▲+20,3% (so với 30 ngày trước); Khách mới tháng này `4.218` ▲+11,9% (so với tháng trước); Tỷ lệ mua lần đầu `24,7%` ▲+3,6 điểm %; Tỷ lệ tái mua `36,9%` ▲+4,2 điểm %.
- **Bộ lọc** (dropdowns): `Đối tác` (Tất cả đối tác + danh sách tên đối tác) | `Nguồn` (Tất cả nguồn, Facebook, TikTok, Website, Zalo) | `Trạng thái` (Tất cả trạng thái, Tái mua tốt, Đã mua, Tiềm năng, Ngủ đông) | `Lần mua` (Tất cả, Chưa mua, 1 lần, Từ 2 lần) | `Khoảng thời gian ghi nhận`.
- **Bảng "Danh sách khách hàng được giới thiệu (180)"** + nút `Xuất Excel`, `Thêm ghi nhận` (primary). Cột: `Mã KH | Họ tên | Người giới thiệu | Nguồn | Ngày ghi nhận | Đơn đầu tiên | Tổng chi tiêu | Số lần mua | Lần mua gần nhất | Trạng thái | (Thao tác)`.
  - Người giới thiệu: `@maianh_aff` (text handle).
  - Nguồn: text pill (Facebook / TikTok / Website / Zalo).
  - Trạng thái: pill — Tái mua tốt (xanh), Đã mua (xanh), Tiềm năng (xám), Ngủ đông (xám/vàng — chưa đo).
  - Phân trang: "Hiển thị 1 – 10 trên 180 khách hàng (mẫu demo)" và số trang 1 2 3 4 5 … 18.
- **Card "Tỷ lệ tái mua theo cohort (theo tháng ghi nhận)"**: combo chart: cột "Số KH lần đầu" + "Số KH tái mua" (trục trái 0–10.000) + đường "Tỷ lệ tái mua" (%: 28,4 / 31,2 / 32,7 / 34,6 / 35,8 / 36,9). X: T08/2024 … T01/2025.
- **Card "Cohort T01/2025"**: KH lần đầu `4.218`; KH tái mua `1.558`; Tỷ lệ `36,9%`.
- **Card "Hành trình khách hàng (tổng quan)"** — funnel: Click `248.360` → Đăng ký `186.420` (→75,1%) → Đơn đầu `46.073` (→24,7%) → Tái mua `17.006` (→36,9%).
- **Panel "Chi tiết khách hàng"** (cột phải của bảng, mở khi chọn 1 dòng; mặc định KH126584): 
  - Tên, Mã KH, badge trạng thái ("Tái mua tốt"), SĐT (che), email, Thành phố, `Người giới thiệu`, `Nguồn`.
  - Tags: `VIP`, `Tái mua cao`.
  - Card "Attribution: AFF001286 — Đã khóa": giải thích "Claim giới thiệu, quyết định nguồn (attribution) và người chăm sóc (care) là 3 đối tượng riêng. Click link đối tác khác không đổi chủ attribution đã khóa." + nút `Mô phỏng click link đối tác khác`.
  - "Lịch sử mua hàng gần đây" (`Xem tất cả`): item `29/01/2025 – Đơn #TM250129-10342 · NMN 12000 Plus · 1.750.000 ₫`.

### 2.4 Đơn hàng (`#/orders`)
- **H1**: Đơn hàng & đồng bộ TN MALL
- **Phụ đề**: Theo dõi đơn hàng Affiliate, trạng thái xử lý và log đồng bộ dữ liệu
- **Toolbar**: date range.
- **KPI (4 card)**: Tổng đơn hợp lệ `28.764` ▲+18,9%; Đơn chờ xác minh `287` ▲+42,6%; Đơn đã hoàn thành `27.951` ▲+19,1%; Lỗi đồng bộ `12` ▼-50,0%.
- **Banner trạng thái kết nối**: "Kết nối TN MALL: Hoạt động bình thường · Đồng bộ cuối: 29/01/2025 14:32 · MOCK" (pill xanh).
- **Tabs**: `Đơn hàng` (mặc định) | `Lỗi đồng bộ` | `Nhật ký webhook`.
- **Bộ lọc**: `Trạng thái` (Tất cả trạng thái, Đã thanh toán, Chờ xác minh) | `Đồng bộ` (Tất cả đồng bộ, Đã đồng bộ, Lỗi đồng bộ) | `Bộ lọc`.
- **Bảng đơn** (9 cột): `# | Mã đơn | Khách hàng | Đối tác | Sản phẩm | Giá trị đơn | TT thanh toán | TT giao hàng | Đủ ĐK hoa hồng | Thời gian đặt | TT đồng bộ` (có cột ⋯ thao tác).
  - Mã đơn: `TM250129-10342` (định dạng TM + yymmdd + số tuần tự).
  - TT thanh toán: Đã thanh toán (xanh) | Chờ xác minh (cam).
  - TT giao hàng: Đang giao (xanh dương) | Hoàn thành (xanh) | Chờ lấy hàng / Chờ xác nhận (cam).
  - TT đồng bộ: Đã đồng bộ (xanh dương) | Lỗi đồng bộ (đỏ).
  - Thao tác: nút ⋯ (`order-menu`).
  - Phân trang: "Hiển thị 1 – 10 trên 90 đơn hàng (mẫu demo)", số trang 1 2 3 4 5 … 9.
- **Card "Nhật ký đồng bộ"** (`Xem tất cả`): list item có tiêu đề, thời gian, mô tả, badge: "Thành công" (xanh), "Lỗi" (đỏ). Ví dụ: "Đồng bộ thành công 29/01/2025 14:32 — Đồng bộ 1.254 đơn hàng từ TN MALL (mock)"; "Gửi webhook đơn hàng — Nhận webhook: 1.254 đơn mới (mock)"; "Đồng bộ thất bại — Lỗi kết nối API TN MALL (HTTP 503) (mock)"; "Thử đồng bộ lại — Tự động thử lại sau 60 giây".
- Nút: `Giả lập webhook TN MALL`.
- **Chart "Đơn hàng theo ngày & Tỷ lệ đồng bộ thành công"**: cột số đơn (0–2.400) + đường tỷ lệ đồng bộ % (90%–100%). X: 01/01 … 29/01.
- **Card "Tổng quan đồng bộ (30 ngày)"**: `99,2%` Tỷ lệ đồng bộ thành công; Đồng bộ thành công 28.552 đơn (99,2%); Lỗi đồng bộ 212 đơn (0,7%); Chưa đồng bộ 0 đơn (0,0%).
- **Modal "Đơn TM250129-10342"** (mở từ ⋯): Khách hàng `Nguyễn Mai Anh`; Đối tác `AFF001286`; Giá trị `1.750.000 ₫`; Đã hoàn `0 ₫`; Bút toán hoa hồng `Chưa có (đơn chưa hoàn thành)`; nút `Đóng`.

### 2.5 Hoa hồng & Đối soát (`#/commission`)
- **H1**: Hoa hồng, đối soát & thanh toán
- **Phụ đề**: Tính toán, kiểm tra và chi trả hoa hồng cho đối tác
- **Header line**: `Kỳ hiện tại: 01/01/2025 – 30/01/2025`.
- **Bộ lọc chiến dịch** (select): Tất cả chiến dịch | Sale Tết 2025 | Ưu đãi Combo Tháng 1 | Ra mắt Liver EX Premium | Bùng nổ TikTok Q1 | Mini Game – Quà liền tay | Black Friday 2024.
- **KPI (4)**: Tổng hoa hồng phát sinh `1.256.400.000 ₫` ▲+24,9%; Chờ duyệt `186.300.000 ₫` ▲+12,7%; Sắp thanh toán `842.500.000 ₫` ▲+21,3%; Đã thanh toán kỳ này `227.600.000 ₫` ▲+18,6%.
- **Tabs (3)**: `Hoa hồng` | `Đối soát` | `Thanh toán`.

**Tab Hoa hồng** (mặc định):
- Tiêu đề bảng "Danh sách hoa hồng theo kỳ"; nút `Bộ lọc`, `Xuất Excel`.
- Bảng (9 cột): `# | Kỳ | Đối tác | Doanh số đủ điều kiện | Tỷ lệ | Hoa hồng | Điều chỉnh | Trạng thái | Người duyệt | Thao tác`.
  - Kỳ: `T01/2025`. Đối tác: avatar + tên + @handle.
  - Tỷ lệ: 15,0% (đối tác cấp cao) | 12,0% | 10,0%.
  - Điều chỉnh: `+2.000.000 ₫` / `-1.000.000 ₫` / `0 ₫` (có dấu).
  - Trạng thái: Chờ duyệt | Đã duyệt | Tạm giữ | Đã thanh toán.
  - Người duyệt: tên hoặc `–`.
- Phân trang: "Hiển thị 1 – 8 trên 40 kết quả" + 1 2 3 4 5.
- Ghi chú (footer): "Tỷ lệ & công thức tính là mẫu (chính sách v1.3 – chưa ký duyệt). Số tiền tính bằng số nguyên VND, quy tắc làm tròn R1-FLOOR. Điều chỉnh thực hiện bằng bút toán ADJUSTMENT, không sửa bút toán cũ."

**Tab Đối soát**:
- Tiêu đề "Đối soát kỳ T01/2025"; 3 số: Tổng bút toán accrual `8.632.700 ₫`; Tổng đảo (reversal) `0 ₫`; Tổng đã chi (payout) `0 ₫`.
- Ghi chú: "Số liệu ledger mẫu: 59 bút toán bất biến. Đối soát với TN MALL (GMV, hoàn trả) dùng adapter mock."
- Card "Cảnh báo đối soát" (`Xem chi tiết`): 23 đơn chênh lệch doanh số (Tổng chênh lệch: 12.460.000 ₫); 8 đơn chưa đủ điều kiện (Đang trong thời gian hoàn/đổi); 5 giao dịch cần điều chỉnh hoa hồng (Tổng điều chỉnh: +2.300.000 ₫).

**Tab Thanh toán** (nội dung trùng với trang Thanh toán, xem 2.6).

### 2.6 Thanh toán (`#/payments`)
- Cùng khung trang với Hoa hồng & Đối soát, tab `Thanh toán` active. Cùng KPI.
- Danh sách đợt chi (dạng card/row): `PAY-20241231-001 · T12/2024 · 76 đối tác · 711.200.000 ₫` — `Lập: Nguyễn Quỳnh Anh · Duyệt: Trần Hoàng Minh` — pill `Đã thanh toán`.
- Card **"Tổng quan chi trả kỳ này"**:
  - Tổng chi trả (Chuyển khoản) `712.842.000 ₫`
  - Số đối tác chi trả `20 đối tác`
  - Ngày chi trả dự kiến `31/01/2025`
  - Kỳ đối soát `T01/2025`
  - Nút: `Tạo đợt thanh toán` (primary) | `Xuất bảng kê` (secondary) | `Từ chối` (danger/secondary)
  - Ghi chú: "Maker-checker: người lập đợt chi không được tự duyệt. Đổi vai trò ở menu tài khoản để thử. Ngân hàng: sandbox mô phỏng."
- Card **"Cảnh báo đối soát"** (`Xem chi tiết`): như mục 2.5.
- Bảng **"Lịch sử thanh toán"** (`Xem tất cả`): `# | Mã đợt chi trả | Kỳ đối soát | Ngày tạo | Ngày thanh toán | Số đối tác | Tổng chi trả | Trạng thái | Người thực hiện | Bảng kê` (nút tải bảng kê).
  - Mẫu: PAY-20241231-001 (T12/2024, 76, 711.200.000 ₫, Đã thanh toán); PAY-20241130-001 (T11/2024, 72, 648.900.000 ₫); PAY-20241031-001 (T10/2024, 69, 593.400.000 ₫).

**Modal "Tạo đợt thanh toán"**:
- Nội dung: "Lập đợt chi cho 20 đối tác đã duyệt, tổng 712.842.000 ₫. Đợt chi phải được người khác phê duyệt."
- Nút: `Hủy` | `Tạo đợt chi`. (Không submit.)

### 2.7 Chiến dịch (`#/campaigns`)
Trang này là **Tạo liên kết giới thiệu** (form sinh link), không phải danh sách chiến dịch.
- **H1**: Tạo liên kết giới thiệu
- **Phụ đề**: Sinh link Affiliate, mã QR và tham số UTM để theo dõi hiệu quả
- **Form 9 bước** (đánh số 1–9, dạng stepper card):
  1. `Chọn đích đến *` — select sản phẩm: "Sản phẩm: NMN 12000 Plus", Krill Omega-3 1000mg, Spirulina Organic, Liver EX Premium, AX21 Anti-Aging, NMN 6000 Basic, Spirulina Tablet 1000, Liver EX Mini.
  2. `Chọn đối tác *` — select (35 đối tác, định dạng "Tên (@handle)"): Nguyễn Thị Mai Anh (@maianh_aff), Trần Minh Đức (@minhduc_review), ... (danh sách đầy đủ trong admin-data.json).
  3. `Chọn chiến dịch *` — select: Sale Tết 2025, Ưu đãi Combo Tháng 1, Ra mắt Liver EX Premium, Bùng nổ TikTok Q1, Mini Game – Quà liền tay.
  4. `Mã giảm giá` — text, placeholder/value "Demo".
  5. `Nguồn truy cập (UTM Source) *` — select: facebook, tiktok, zalo, youtube, website.
  6. `Medium (UTM Medium) *` — select: post, video, story, ads, livestream.
  7. `Campaign name (UTM Campaign) *` — text (không dấu, viết liền hoặc dấu gạch dưới).
  8. `Content (UTM Content)` — text (vd: banner, video1, review).
  9. `Custom alias (Tùy chỉnh link rút gọn)` — text (a-z, 0-9, -).
- Nút: `Sinh liên kết` (primary) | `Sao chép` | `Tạo mã QR` | `Xem trước liên kết`.
- Khối **"Liên kết Affiliate (đầy đủ tham số UTM)"**: `https://tnmall.vn/san-pham/nmn-12000?ref=maianh_aff&campaign=sale_tet_2025&utm_source=facebook&utm_medium=post&utm_campaign=sale_tet_2025&utm_content=review_nmn&coupon=TET20`
- Khối **"Liên kết rút gọn"**: `https://tnmall.vn/r/tet2025-nmn-719` + nút `Sao chép link rút gọn`.
- Khối **Mã giới thiệu**: avatar `TN`, `Mã giới thiệu: MAIANH001`, nút `Tải mã QR (PNG)`.
- Card **"Thống kê lượt nhấp (7 ngày gần nhất)"**: `1.264` ▲+18,9%; line/area chart 24/01 → 30/01 (trục 0–300); link `Xem chi tiết`.
- Bảng **"Liên kết đã tạo gần đây"** (`Xem tất cả`): `# | Tên liên kết (+ URL rút gọn) | Đối tác | Chiến dịch | Lượt nhấp ⇅ | Đơn hàng ⇅ | Chuyển đổi ⇅ | Ngày tạo ⇅`. 5 dòng (xem admin-data.json).

### 2.8 Sản phẩm (`#/products`)
- **H1**: Sản phẩm & chiến dịch Affiliate
- **Phụ đề**: Quản lý danh mục sản phẩm, chương trình khuyến khích và hiệu quả bán hàng
- **KPI (4)**: Tổng sản phẩm `42` ▲+7,7%; Sản phẩm đang mở Affiliate `36` ▲+12,5%; Chiến dịch đang chạy `8` ▲+33,3%; Tỷ lệ chuyển đổi trung bình `4,28%` ▲+0,8 điểm %.
- **Filter chips**:
  - Danh mục sản phẩm: Tất cả | NMN | Krill | Spirulina | Liver EX | AX21
  - Trạng thái chiến dịch: Tất cả | Đang chạy | Sắp diễn ra | Đã kết thúc
- **Bảng "Danh sách sản phẩm (10)"** + `Bộ lọc`: `# | Sản phẩm (ảnh/tag danh mục + tên) | SKU | Giá bán ⇅ | Hoa hồng ⇅ | Tồn kho ⇅ | Tình trạng Affiliate | Chiến dịch | (Thao tác)`.
  - Tình trạng Affiliate: `Đang mở` | `Đã đóng` (text).
  - Chiến dịch: tên hoặc `—`.
- Footer note: "Hiển thị 10 sản phẩm mẫu · Giá & tồn kho là projection từ TN MALL (mock) · Tỷ lệ hoa hồng sản phẩm là mẫu chờ duyệt".
- **Panel chi tiết chiến dịch** (bên phải, chọn "Sale Tết 2025"):
  - Trạng thái pill `Đang chạy`; tên chiến dịch.
  - Danh sách chiến dịch (select/chip): Sale Tết 2025, Ưu đãi Combo Tháng 1, Ra mắt Liver EX Premium, Bùng nổ TikTok Q1, Mini Game – Quà liền tay, Black Friday 2024.
  - Thời gian diễn ra `01/01/2025 – 30/01/2025`; Mục tiêu GMV `15.000.000.000 ₫`; GMV thực tế `12.850.000.000 ₫` (Đạt 85,7%) — thanh tiến độ.
  - Sản phẩm tham gia (5): chip NMN, KRILL, SPIRU, LIVER, AX21 + `+ Thêm`.
  - Nút: `Tạo chiến dịch` (primary) | `Phân quyền đối tác` (secondary).
- **Card "Hiệu quả bán hàng theo sản phẩm"** (30 ngày): combo chart — cột "Doanh số (GMV) tỷ đ" (NMN 12000 Plus 2,56; Krill Omega-3 1,78; Spirulina Organic 1,21; Liver EX Premium 1,64; AX21 Anti-Aging 2,21) + đường "Tỷ lệ chuyển đổi" (4,6%; 4,1%; 3,6%; 4,3%; 5,1%). Trục trái GMV 0–3,0; phải 0–6%.
- **Bảng "Top sản phẩm có tỷ lệ chuyển đổi cao nhất"** (`Xem tất cả`): `# | Sản phẩm | Tỷ lệ chuyển đổi | Doanh số (GMV)` (AX21 5,10% 2.210.000.000 ₫; NMN 12000 Plus 4,60% 2.560.000.000 ₫; Liver EX Premium 4,30% 1.640.000.000 ₫; Krill Omega-3 1000mg 4,10% 1.780.000.000 ₫; Spirulina Organic 3,60% 1.210.000.000 ₫).

#### Modal "Tạo chiến dịch"
- Fields: `Tên chiến dịch *` (text) | `Bắt đầu` (date) | `Kết thúc` (date) | `Mục tiêu GMV (VND)` (number) | `Mã UTM campaign *` (text, placeholder `vd: sale_thang_2`).
- Nút: `Hủy` | `Tạo`.

### 2.9 Báo cáo (`#/reports`)
- **H1**: Báo cáo
- **Phụ đề**: Tổng hợp hiệu quả chương trình — dữ liệu demo
- **Banner note**: "Bộ báo cáo đầy đủ, dự báo và trợ lý AI thuộc phân hệ analytics-ai (sprint sau). Màn hình này chỉ tổng hợp từ dữ liệu demo hiện có."
- **KPI (4 card)**: GMV kỳ `12,85 tỷ ₫`; Bút toán ledger `59`; Liên kết đã tạo `5`; Sự kiện audit `2`.
- **Chart "Doanh số & đơn hàng"** (`Doanh số (GMV)` + `Đơn hàng hợp lệ`), cùng cấu trúc dashboard, X: 01/01–29/01.
- Không có tab/modal/bộ lọc đáng kể được quan sát (chưa thấy phân trang/bảng).

### 2.10 Đào tạo (`#/training`)
- **H1**: Đào tạo
- **Phụ đề**: Học viện đối tác — nội dung đã được duyệt
- **Note**: "Nội dung quảng cáo thực phẩm bảo vệ sức khỏe phải được người chịu trách nhiệm duyệt và có phiên bản. Không khẳng định công dụng phòng/chữa bệnh. Nội dung dưới đây là khung demo."
- **Danh sách khóa học** (card list, mỗi card: badge loại + tên + mô tả + số bài + phiên bản):
  1. `Bắt buộc` — Nhập môn Affiliate TN MALL — 6 bài học · phiên bản 1.0 (demo)
  2. `Bắt buộc` — Kiến thức sản phẩm NMN & AX21 — 8 bài học · phiên bản 1.0 (demo)
  3. `Bắt buộc` — Quy định quảng cáo thực phẩm bảo vệ sức khỏe — 4 bài học · phiên bản 1.0 (demo)
  4. `Tự chọn` — Kỹ năng livestream bán hàng — 5 bài học · phiên bản 1.0 (demo)
  5. `Tự chọn` — Chăm sóc khách hàng tái mua — 3 bài học · phiên bản 1.0 (demo)
- Chưa khảo sát modal chi tiết khóa học (không nằm trong phạm vi đã thử).

### 2.11 Tích hợp TN MALL (`#/integration`)
- **H1**: Tích hợp TN MALL
- **Phụ đề**: Adapter đơn hàng, hoàn trả và danh mục sản phẩm
- **Banner cảnh báo (vàng)**: "Trạng thái: MOCK. Chưa có API TN MALL thật. Cần TN MALL cung cấp: tài liệu API, môi trường sandbox, cơ chế ký webhook (HMAC secret), danh sách trạng thái đơn và quy tắc hoàn trả."
- **Card số liệu**: Webhook inbox `0 sự kiện đã xử lý`; Đơn hàng (projection) `90 đơn mẫu`; Sản phẩm (projection) `10 SKU mẫu`.
- **Bảng "Endpoint dự kiến (hợp đồng API — bản nháp)"**: `Phương thức | Đường dẫn | Mô tả`
  - POST `/webhooks/tnmall` — Nhận order.created / order.completed / order.refunded (ký HMAC, idempotent theo event.id)
  - GET `/integrations/tnmall/orders?since=` — Đồng bộ bù (pull) khi webhook lỗi
  - GET `/integrations/tnmall/products` — Projection danh mục sản phẩm
  - POST `/payouts/{id}/send` — Gửi lệnh chi qua bank adapter (sandbox)
  - Badge method: POST/GET màu xanh dương (`#dbeafe`/`#1d4ed8`).
- Nút: `Mở trình giả lập webhook` (secondary, không bấm).

### 2.12 Cài đặt (`#/settings`)
- **H1**: Cài đặt
- **Phụ đề**: Phân quyền, nhật ký kiểm toán và dữ liệu demo
- **Header action**: `Khôi phục dữ liệu demo` (secondary/danger — KHÔNG bấm trong khảo sát).
- **Ma trận phân quyền (RBAC)** — card, note: "Kiểm tra tại lớp dịch vụ · Đối tác bị giới hạn phạm vi chính mình (chống IDOR)".
  - Cột: `Quyền | CEO | Kế toán | Vận hành đối tác | Quản lý chính sách | Đối tác (cổng đối tác)`
  - Ô là checkmark (✓) hoặc trống; giá trị chi tiết chưa đo từng ô (nên dùng icon `check` xanh / `minus` xám).
  - 22 dòng quyền (mã quyền hiển thị cạnh tên):
    - Xem tổng quan điều hành `dashboard.view`
    - Xem đối tác `partner.view`
    - Sửa/khóa đối tác `partner.edit`
    - Xác minh hồ sơ `application.review`
    - Phê duyệt hồ sơ `application.approve`
    - Xem chính sách `policy.view`
    - Soạn bản nháp chính sách `policy.draft`
    - Kích hoạt chính sách `policy.publish`
    - Quản lý chiến dịch `campaign.manage`
    - Tạo liên kết cho đối tác `link.create`
    - Xem khách hàng `customer.view`
    - Xem đơn hàng `order.view`
    - Quản lý tích hợp TN MALL `integration.manage`
    - Xem hoa hồng `commission.view`
    - Lập đợt chi (maker) `payout.create`
    - Duyệt đợt chi (checker) `payout.approve`
    - Xuất bảng kê `payout.export`
    - Xem nhật ký kiểm toán `audit.view`
    - Xem số liệu của chính mình `self.dashboard`
    - Tạo link của chính mình `self.link.create`
    - Xem hoa hồng của chính mình `self.commission.view`
- **Nhật ký kiểm toán (audit trail)** — "2 sự kiện · chỉ thêm, không sửa": `Thời gian | Người thực hiện | Hành động | Đối tượng | Chi tiết`
  - 27/01/2025 14:05 | Trần Quốc Bảo | partner.bank.update | AFF001286 | Cập nhật thông tin tài khoản ngân hàng (giá trị đã che)
  - 15/01/2025 09:00 | Triệu Nhung | policy.publish | v1.3 | Kích hoạt chính sách v1.3
- **Card "Kiểm thử"**: "Bộ test domain (tiền, ledger, idempotency, maker-checker, RBAC/IDOR, chính sách) chạy trong trình duyệt." + nút `Mở trang kiểm thử`.

### 2.13 Sub-routes trong sidebar (chưa khảo sát)
- `Đối tác > Hồ sơ đăng ký` và `Đối tác > Cấp bậc & chính sách` xuất hiện trong menu nhưng chưa mở được hash route riêng trong khảo sát này. Ghi nhận là **chưa khảo sát**.
- `Đối tác > Danh sách đối tác` = `#/partners`.

---

## 3. Shared components (tóm tắt để clone)
- **Card**: `bg #fff; border 1px solid #edf1f5; radius 14px; shadow 0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.05)`.
- **Grid**: KPI `g5` (5 cột) ở dashboard; `4` cột ở các trang khác; chart 2/3 + 1/3.
- **KPI card**: header (icon trong ô vuông tint + nhãn + icon info) → giá trị lớn → delta (`▲/▼ %` + "so với …") → sparkline 34px cao ở đáy card (gradient area).
- **Tabs**: underline/segmented; tab active chữ `#0f172a`, underline/nền xanh lá `#0f9d74`.
- **Modal**: overlay tối nhẹ, card trắng bo ~16px, tiêu đề 20px/700, footer 2 nút căn phải (Hủy secondary, primary xanh).
- **Drawer/panel phải**: cột phải cố định ~360px trong các trang (customers, products) — chọn dòng để cập nhật.
- **Pagination**: "Hiển thị x – y trên N … (mẫu demo)" + dãy số trang; trang hiện tại nền xanh lá, chữ trắng.
- **Empty/banner note**: nền vàng nhạt `#fffbeb` / đường viền amber cho cảnh báo MOCK/demo.
- Responsive: menu toggle ở topbar khi màn hình nhỏ (sidebar ẩn/hiện qua nút `layers`).

---

## 4. Chưa khảo sát / hạn chế
- Ctrl+K không hiển thị command palette rõ ràng; chỉ focus ô tìm kiếm (chưa xác minh gợi ý kết quả).
- Chưa mở: Đối tác > Hồ sơ đăng ký, Đối tác > Cấp bậc & chính sách, chi tiết khóa học, Tích hợp > Mở trình giả lập webhook, Chỉnh sửa hồ sơ đối tác, Gửi thông báo, Khóa tạm thời.
- Màu chính xác của một số pill (Chờ duyệt, Tạm dừng, Tier Bronze/Silver/Gold/Sapphire, Ngủ đông) và màu từng phần donut chưa đo được chắc chắn; giá trị ghi là suy luận từ bảng màu hệ thống.
- Không download file; mọi số liệu đọc từ DOM/text của trang demo.
