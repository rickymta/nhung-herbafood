export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const NAV: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  {
    label: "Tầm soát", href: "/assessment",
    children: [
      { label: "Test Đột quỵ 10 năm", href: "/assessment/general" },
      { label: "Tầm soát Rung nhĩ", href: "/assessment/afib" },
      { label: "Thực phẩm bảo vệ", href: "/products?category=supplement" },
      { label: "Dấu hiệu B.E.F.A.S.T", href: "/symptoms" },
      { label: "Gói khám tầm soát", href: "/products?category=package" },
      { label: "Góc sức khỏe Y khoa", href: "/education" },
    ],
  },
  { label: "B.E.F.A.S.T", href: "/symptoms" },
  {
    label: "Nhà thuốc", href: "/products",
    children: [
      { label: "Thực phẩm chức năng mạch não", href: "/products?category=supplement" },
      { label: "Gói khám tầm soát đột quỵ", href: "/products?category=package" },
      { label: "Thuốc dự phòng tim mạch", href: "/products?q=tim+mach" },
      { label: "Chăm sóc sau tai biến", href: "/education?topic=recovery" },
      { label: "Trang thiết bị y tế & Máy đo AFib", href: "/products?category=device" },
      { label: "Đặt thuốc & Gói khám online", href: "/products" },
    ],
  },
  { label: "Kết quả tầm soát", href: "/results" },
  { label: "Tra cứu đơn hàng & lịch hẹn", href: "/orders/lookup" },
  { label: "Tải ứng dụng", href: "/download-app" },
];

export const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "VỀ CHÚNG TÔI", links: [["Giới thiệu hệ thống", "/"], ["Hệ thống cơ sở & nhà thuốc", "/products"], ["Giấy phép hoạt động y tế", "/terms"], ["Quy chế hoạt động WebApp", "/terms"], ["Đội ngũ chuyên môn y khoa", "/education"], ["Tin tức & Chiến dịch cộng đồng", "/education"]] },
  { title: "DANH MỤC", links: [["Trung tâm Tầm soát TNStrokeGuard", "/assessment/general"], ["Góc sức khỏe Tim mạch - Đột quỵ", "/education"], ["Đánh giá Đột quỵ Toàn diện 10 năm", "/assessment/general"], ["Tầm soát Rung nhĩ (AFib)", "/assessment/afib"], ["Hồ sơ & Tra cứu Kết quả tầm soát", "/results"], ["6 Dấu hiệu vàng B.E.F.A.S.T", "/symptoms"], ["Hướng dẫn sơ cứu Giờ vàng 115", "/symptoms?tab=emergency"]] },
  { title: "TÌM HIỂU THÊM", links: [["Chính sách đặt cọc & gói khám", "/refund-policy"], ["Chính sách nội dung y khoa", "/education"], ["Chính sách đổi trả thuốc 30 ngày", "/refund-policy"], ["Chính sách giao nhận dược phẩm", "/cart"], ["Chính sách bảo mật dữ liệu (NĐ 13)", "/privacy"], ["Chính sách Cookie độc lập", "/cookie-policy"], ["Kiểm tra đơn hàng điện tử", "/orders/lookup"], ["Điều khoản sử dụng TNStrokeGuard 247", "/terms"], ["Quản trị", "/admin/login"]] },
];

export const BEFAST = [
  { letter: "B", word: "BALANCE", title: "Mất thăng bằng đột ngột", description: "Choáng váng dữ dội, đi đứng loạng choạng, mất khả năng phối hợp vận động hoặc ngã khuỵu không rõ nguyên nhân.", checkHow: "Quan sát xem người bệnh có thể đứng vững hoặc bước thẳng hàng hay không." },
  { letter: "E", word: "EYES", title: "Rối loạn thị giác", description: "Mờ mắt đột ngột ở một hoặc cả hai mắt, nhìn đôi (song thị) hoặc mất một phần vùng nhìn.", checkHow: "Hỏi người bệnh có nhìn rõ các ngón tay trước mặt hoặc bị nhòe hình hay không." },
  { letter: "F", word: "FACE", title: "Méo lệch khuôn mặt", description: "Một bên cơ mặt bị xệ xuống, nhân trung lệch, tê bì nửa mặt hoặc nụ cười không cân đối.", checkHow: "Yêu cầu người bệnh mỉm cười hoặc nhe răng để kiểm tra độ cân xứng hai bên mép." },
  { letter: "A", word: "ARM", title: "Yếu hoặc liệt tay chân", description: "Đột ngột tê bì, yếu sức hoặc không thể nhấc nổi một bên cánh tay hay chân, cầm nắm rơi đồ vật.", checkHow: "Yêu cầu giơ đồng thời hai tay ngang vai trong 10 giây xem có tay nào rơi thõng xuống không." },
  { letter: "S", word: "SPEECH", title: "Nói ngọng, khó nói", description: "Nói lắp, dính chữ, tìm từ khó khăn, nói không rõ nghĩa hoặc không hiểu câu hỏi đơn giản.", checkHow: "Yêu cầu lặp lại một câu ngắn rõ ràng như: \"Hôm nay trời nắng đẹp\"." },
  { letter: "T", word: "TIME", title: "Thời gian vàng cấp cứu", description: "Nếu xuất hiện DÙ CHỈ 1 trong 5 dấu hiệu trên, hãy gọi ngay 115 và ghi nhớ chính xác thời điểm khởi phát triệu chứng.", checkHow: "Ghi lại giờ phút xuất hiện triệu chứng đầu tiên để báo cho bác sĩ cấp cứu tiêu sợi huyết." },
];

export const EMERGENCY_ACTIONS = [
  "Gọi ngay tổng đài Cấp cứu 115 hoặc đưa thẳng tới bệnh viện gần nhất có Đơn vị Đột quỵ.",
  "Đặt người bệnh nằm nghiêng an toàn (nghiêng 30–45 độ), đầu hơi kê cao nhẹ để tránh sặc đường thở.",
  "Nới lỏng cổ áo, cà vạt, thắt lưng để giúp hô hấp thông thoáng.",
  "Ghi nhớ chính xác thời điểm người bệnh bắt đầu có triệu chứng bất thường đầu tiên.",
  "Mang theo danh sách các thuốc đang uống (đặc biệt thuốc huyết áp, tiểu đường, chống đông máu).",
];
export const EMERGENCY_DONOTS = [
  "TUYỆT ĐỐI KHÔNG chích máu 10 đầu ngón tay, dái tai hay cạo gió, bấm huyệt.",
  "KHÔNG tự ý cho uống thuốc hạ huyết áp ngậm dưới lưỡi hay bất kỳ viên thuốc truyền miệng nào.",
  "KHÔNG cho người bệnh ăn hoặc uống nước khi đang lơ mơ, nói khó hoặc nuốt nghẹn.",
  "KHÔNG chờ đợi \"nằm nghỉ xem có tự khỏi không\" ngay cả khi triệu chứng thoáng qua rồi giảm (cơn TIA).",
];

const P = "https://tn-stroke-guard.vercel.app/images/prevention/";
export const PREVENTION_AGE = [
  { group: "NGƯỜI TRẺ (18 – 39 TUỔI)", image: P + "prev-young-adult.jpg", items: ["Kiểm soát thức khuya & căng thẳng kéo dài", "Ngưng thuốc lá, thuốc lá điện tử & rượu bia", "Giảm đồ ăn nhanh, trà sữa & mỡ nội tạng", "Tầm soát dị dạng mạch não khi đau đầu mạn"] },
  { group: "TUỔI TRUNG NIÊN (40 – 59 TUỔI)", image: P + "prev-middle-age.jpg", items: ["Theo dõi huyết áp định kỳ dưới 130/80 mmHg", "Xét nghiệm mỡ máu LDL-C & đường huyết đói", "Lưu ý nội tiết tiền mãn kinh & huyết áp ở nữ", "Duy trì 150 phút vận động thể lực mỗi tuần"] },
  { group: "NGƯỜI CAO TUỔI (TRÊN 60 TUỔI)", image: P + "prev-seniors.jpg", items: ["Đo huyết áp sáng – tối & uống thuốc đúng giờ", "Sàng lọc Rung nhĩ (AFib) ngừa huyết khối tim", "Siêu âm Doppler động mạch cảnh định kỳ", "Phòng co mạch khi trời trở lạnh hoặc tắm đêm"] },
  { group: "TRẺ EM & THANH THIẾU NIÊN", image: P + "prev-children.jpg", items: ["Hình thành thói quen ăn nhạt, giảm đồ mặn", "Phòng ngừa thừa cân, béo phì học đường", "Sàng lọc sớm bệnh tim bẩm sinh & rối loạn đông máu", "Nhận biết dấu hiệu B.E.F.A.S.T ở trẻ nhỏ"] },
];

export const PREVENTION_SEASON = [
  { group: "MÙA LẠNH & GIAO MÙA", image: P + "prev-seniors.jpg", items: ["Giữ ấm cổ, ngực, chân tay khi ra ngoài", "Tránh tắm đêm, tắm nước lạnh đột ngột", "Đo huyết áp thường xuyên hơn khi trời lạnh", "Uống đủ nước, không bỏ thuốc huyết áp"] },
  { group: "MÙA NÓNG", image: P + "prev-young-adult.jpg", items: ["Tránh mất nước, mất muối khi ra mồ hôi nhiều", "Hạn chế làm việc ngoài trời giờ nắng gắt", "Bổ sung nước, điện giải, trái cây tươi", "Hạn chế rượu bia, đồ uống nhiều đường"] },
  { group: "DỊP LỄ TẾT & TIỆC TÙNG", image: P + "prev-middle-age.jpg", items: ["Hạn chế rượu bia, ăn nhiều đồ béo mặn", "Duy trì giờ giấc ngủ nghỉ đều đặn", "Không quên thuốc điều trị bệnh nền khi đi xa", "Biết sẵn số cấp cứu 115 và bệnh viện gần nhất"] },
  { group: "LỐI SỐNG VĂN PHÒNG", image: P + "prev-children.jpg", items: ["Đứng dậy vận động 5 phút sau mỗi 1 giờ ngồi", "Giảm căng thẳng, thở sâu, thiền ngắn", "Ăn nhạt, hạn chế đồ ăn nhanh, trà sữa", "Khám sức khỏe tổng quát mỗi năm"] },
];

export const FEATURE_TILES = [
  { title: "TẦM SOÁT ĐỘT QUỴ", sub: "Miễn phí 100%", cta: "KIỂM TRA NGAY", href: "/assessment", icon: "shield" },
  { title: "DƯỢC PHẨM & TPBVSK", sub: "Chính hãng kiểm định", cta: "TẦM SOÁT NGAY", href: "/products", icon: "pill" },
  { title: "DƯỢC SĨ ĐỒNG HÀNH", sub: "Tư vấn 1:1 miễn phí", cta: "GỌI 1900 6789", href: "tel:19006789", icon: "headset" },
  { title: "THEO DÕI ĐỀU MỖI NGÀY", sub: "Hồ sơ & nhắc lịch", cta: "XEM KẾT QUẢ", href: "/results", icon: "activity" },
] as const;

export const CATEGORY_TILES = [
  { title: "Thần kinh não", sub: "Tuần hoàn máu não", href: "/products?q=ginkgo", color: "from-orange-400 to-orange-600", icon: "brain" },
  { title: "Tim mạch - Huyết áp", sub: "Ổn định nhịp tim", href: "/products?category=device", color: "from-rose-400 to-rose-600", icon: "heart" },
  { title: "Mỡ máu - Thành mạch", sub: "Nattokinase & Omega", href: "/products?q=omega", color: "from-amber-400 to-orange-500", icon: "droplet" },
  { title: "Dinh dưỡng dự phòng", sub: "Chế độ ăn chuẩn DASH", href: "/education?topic=lifestyle", color: "from-emerald-400 to-teal-600", icon: "leaf" },
  { title: "Phục hồi vận động", sub: "Chăm sóc sau tai biến", href: "/education?topic=recovery", color: "from-sky-400 to-blue-600", icon: "dumbbell" },
] as const;

export const POLICY_PAGES: Record<string, { eyebrow: string; title: string; intro: string; sections: { h: string; p: string[] }[]; links: [string, string][] }> = {
  terms: {
    eyebrow: "Quy chế hoạt động & Trách nhiệm pháp lý",
    title: "Điều Khoản Sử Dụng",
    intro: "Bằng việc truy cập và sử dụng TNStrokeGuard, bạn đồng ý với các điều khoản dưới đây.",
    sections: [
      { h: "1. Phạm vi cung cấp dịch vụ", p: ["TNStrokeGuard cung cấp công cụ sàng lọc nguy cơ đột quỵ, nội dung giáo dục sức khỏe và nền tảng đặt mua thực phẩm bảo vệ sức khỏe, thiết bị y tế, gói khám tầm soát.", "Các công cụ sàng lọc chỉ mang tính tham khảo, không phải chẩn đoán y khoa và không thay thế tư vấn của bác sĩ."] },
      { h: "2. Minh bạch thông tin", p: ["Chúng tôi cam kết không sử dụng các tuyên bố tuyệt đối kiểu \"số 1\", không đăng đánh giá giả mạo, không cam kết công dụng chữa bệnh đối với thực phẩm bảo vệ sức khỏe."] },
      { h: "3. Xác thực đơn hàng", p: ["Đơn hàng có thể được dược sĩ gọi điện hoặc nhắn tin xác nhận trước khi giao. Vui lòng cung cấp đúng số điện thoại và địa chỉ nhận hàng."] },
      { h: "4. Sở hữu trí tuệ", p: ["Toàn bộ nội dung, hình ảnh, thương hiệu trên website thuộc quyền sở hữu của TNStrokeGuard hoặc đối tác cấp phép. Không sao chép khi chưa có sự đồng ý bằng văn bản."] },
      { h: "5. Luật điều chỉnh", p: ["Điều khoản này được điều chỉnh bởi pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Tranh chấp được giải quyết thông qua thương lượng, nếu không thành sẽ đưa ra Tòa án có thẩm quyền."] },
    ],
    links: [["Chính sách bảo mật", "/privacy"], ["Chính sách Cookie", "/cookie-policy"], ["Chính sách hoàn tiền", "/refund-policy"]],
  },
  privacy: {
    eyebrow: "Bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP)",
    title: "Chính Sách Bảo Mật",
    intro: "Chúng tôi coi dữ liệu sức khỏe và thông tin cá nhân của bạn là thông tin nhạy cảm và bảo vệ theo quy định pháp luật.",
    sections: [
      { h: "1. Thông tin chúng tôi thu thập", p: ["Họ tên, số điện thoại, email, địa chỉ giao hàng khi đặt hàng; năm sinh, giới tính và câu trả lời sàng lọc khi làm bài đánh giá; dữ liệu kỹ thuật như cookie, loại thiết bị."] },
      { h: "2. Mục đích sử dụng", p: ["Xử lý đơn hàng, giao nhận, chăm sóc khách hàng; hiệu chỉnh thuật toán đánh giá nguy cơ; cải thiện dịch vụ. Chúng tôi không bán dữ liệu cá nhân cho bên thứ ba."] },
      { h: "3. Quyền của bạn", p: ["Bạn có quyền truy cập, chỉnh sửa, yêu cầu xóa dữ liệu và rút lại sự đồng ý bất kỳ lúc nào bằng cách liên hệ tổng đài 1900 6789."] },
      { h: "4. Lưu trữ & bảo mật", p: ["Dữ liệu được lưu trữ trên hệ thống có kiểm soát truy cập. Chỉ nhân sự có thẩm quyền mới được truy cập thông tin cần thiết cho công việc."] },
    ],
    links: [["Điều khoản sử dụng", "/terms"], ["Chính sách Cookie", "/cookie-policy"]],
  },
  "refund-policy": {
    eyebrow: "Chính sách đổi trả & hoàn tiền",
    title: "Chính Sách Hoàn Tiền & Đổi Trả",
    intro: "Quyền lợi của bạn được bảo đảm với chính sách đổi trả 30 ngày.",
    sections: [
      { h: "1. Điều kiện đổi trả", p: ["Sản phẩm còn nguyên tem, hộp, chưa qua sử dụng (trừ trường hợp lỗi do nhà sản xuất), trong vòng 30 ngày kể từ ngày nhận hàng. Dược phẩm đã mở nắp không áp dụng đổi trả trừ khi có lỗi chất lượng."] },
      { h: "2. Hoàn tiền", p: ["Tiền hoàn về phương thức thanh toán ban đầu trong 3–7 ngày làm việc sau khi chúng tôi nhận và kiểm tra hàng trả về."] },
      { h: "3. Gói khám tầm soát & đặt cọc", p: ["Có thể đổi lịch miễn phí trước 24 giờ. Hủy gói trước 48 giờ được hoàn 100% tiền cọc; hủy sát giờ hoàn 50%."] },
      { h: "4. Giao nhận", p: ["Miễn phí giao hàng cho đơn từ 500.000đ; đơn dưới mức này phí tạm tính 30.000đ. Được mở hộp kiểm tra hàng trước khi thanh toán."] },
    ],
    links: [["Điều khoản sử dụng", "/terms"], ["Tra cứu đơn hàng", "/orders/lookup"]],
  },
  "cookie-policy": {
    eyebrow: "Quyền riêng tư trực tuyến",
    title: "Chính Sách Cookie",
    intro: "Trang web sử dụng cookie và bộ nhớ trình duyệt để hoạt động ổn định và ghi nhớ lựa chọn của bạn.",
    sections: [
      { h: "1. Cookie thiết yếu", p: ["Dùng để lưu giỏ hàng, mã giới thiệu (affiliate) và lựa chọn đồng ý cookie. Không thể tắt vì cần thiết cho hoạt động của website."] },
      { h: "2. Cookie phân tích", p: ["Giúp chúng tôi hiểu cách trang web được sử dụng để cải thiện trải nghiệm. Chỉ bật khi bạn chấp nhận."] },
      { h: "3. Quản lý cookie", p: ["Bạn có thể thay đổi lựa chọn bằng cách xóa dữ liệu trang web trong trình duyệt, khi đó banner đồng ý sẽ hiển thị lại."] },
    ],
    links: [["Chính sách bảo mật", "/privacy"], ["Điều khoản sử dụng", "/terms"]],
  },
};
