import type { DatabaseSync } from "node:sqlite";

const BASE = "https://tn-stroke-guard.vercel.app";
const img = (p: string) => `${BASE}${p}`;

type SeedProduct = {
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: "supplement" | "package" | "device";
  origin: string;
  price: number;
  original?: number;
  unit: string;
  pack: string;
  image: string;
  gallery?: string[];
  variants: { label: string; price: number }[];
  badges: string[];
  gift?: boolean;
  short: string;
  description: string;
  ingredients?: string;
  usage?: string;
  stock: number;
  sold: number;
  flash?: { limit: number; sold: number };
  commission: number;
  rating: number;
  reviews: number;
  featured?: boolean;
};

const PRODUCTS: SeedProduct[] = [
  {
    slug: "ginkgo-biloba-hoat-huyet-nao",
    sku: "TNSG-GKB-001",
    name: "Viên uống Ginkgo Biloba chuẩn hóa Orihiro Nhật Bản hỗ trợ tăng tuần hoàn máu não, giảm hoa mắt chóng mặt",
    brand: "Orihiro",
    category: "supplement",
    origin: "Nhật Bản",
    price: 350000,
    original: 410000,
    unit: "Hộp",
    pack: "Hộp 3 Vỉ x 10 Viên",
    image: img("/images/products/prod-ginkgo.jpg"),
    gallery: [img("/images/products/prod-ginkgo.jpg"), img("/images/products/prod-coq10.jpg"), img("/images/products/prod-omega3.jpg")],
    variants: [{ label: "Hộp 3 Vỉ x 10 Viên", price: 350000 }],
    badges: ["★ CHÍNH HÃNG", "Hoạt huyết não"],
    short: "Chiết xuất lá bạch quả Ginkgo Biloba chuẩn hóa giúp giãn mạch vi tuần hoàn, tăng lưu lượng oxy lên não, giảm nhanh triệu chứng tiền đình.",
    description:
      "Viên uống Ginkgo Biloba Orihiro được bào chế từ chiết xuất lá bạch quả chuẩn hóa theo tiêu chuẩn Nhật Bản, chứa hai nhóm hoạt chất chính là flavonoid glycosid và terpen lactone.\n\nSản phẩm giúp giãn mạch vi tuần hoàn, tăng lưu lượng oxy và glucose đến tế bào thần kinh, đồng thời hỗ trợ chống oxy hóa bảo vệ tế bào não trước các gốc tự do. Phù hợp với người trung niên, người cao tuổi hay hoa mắt, chóng mặt, ù tai, đau đầu, mất ngủ hoặc suy giảm trí nhớ.\n\nCông dụng & quyền lợi nổi bật:\n- Tăng lưu lượng tưới máu não và tế bào tiền đình\n- Giảm đau đầu, hoa mắt, chóng mặt và mất ngủ\n- Tăng cường khả năng tập trung và trí nhớ\n\nLưu ý: sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.",
    ingredients: "Chiết xuất lá bạch quả (Ginkgo biloba extract) 120 mg; Vitamin B1; Vitamin B6; Chất độn, chất chống ẩm vừa đủ 1 viên.",
    usage: "Người lớn uống 2 viên/ngày, chia 2 lần sau bữa ăn, uống với nhiều nước. Dùng liên tục 2–3 tháng để thấy rõ hiệu quả. Người đang dùng thuốc chống đông cần hỏi ý kiến bác sĩ trước khi sử dụng.",
    stock: 180,
    sold: 1268,
    flash: { limit: 200, sold: 143 },
    commission: 15,
    rating: 5.0,
    reviews: 98,
  },
  {
    slug: "omron-hem-7156",
    sku: "TNSG-OMR-7156",
    name: "Máy đo huyết áp bắp tay Omron HEM-7156",
    brand: "Omron",
    category: "device",
    origin: "Nhật Bản",
    price: 849000,
    original: 990000,
    unit: "Cái",
    pack: "Máy + Vòng bít + Pin AA",
    image: img("/images/products/prod-omron-bp.jpg"),
    variants: [{ label: "Máy + Vòng bít + Pin AA", price: 849000 }],
    badges: ["★ CHÍNH HÃNG", "Bảo hành 5 năm"],
    gift: true,
    short: "Máy đo huyết áp bắp tay Omron HEM-7156 đo chính xác, có cảnh báo cử động và nhịp tim không đều.",
    description:
      "Omron HEM-7156 là dòng máy đo huyết áp bắp tay tự động được tin dùng tại các phòng khám và gia đình nhờ độ chính xác cao và dễ sử dụng.\n\nMáy tích hợp công nghệ Intellisense, vòng bít xoay 360° thuận tiện cho cả người lớn tuổi, bộ nhớ lưu 60 lần đo và biểu tượng cảnh báo nhịp tim không đều (IHB) hỗ trợ phát hiện sớm bất thường.\n\nĐặc điểm nổi bật:\n- Đo tự động chỉ với một nút bấm\n- Cảnh báo nhịp tim không đều và cử động khi đo\n- Bộ nhớ 60 lần đo, tính giá trị trung bình\n- Bảo hành chính hãng 5 năm",
    usage: "Ngồi nghỉ 5 phút, đặt vòng bít ngang tim, quấn cách khuỷu tay 1–2 cm. Nhấn START, giữ yên tay và không nói chuyện khi đo. Đo sáng sau khi thức dậy và tối trước khi ngủ.",
    stock: 60,
    sold: 412,
    commission: 8,
    rating: 4.9,
    reviews: 64,
  },
  {
    slug: "coq10-cardioprotect",
    sku: "TNSG-CQ10-002",
    name: "Viên uống Coenzyme Q10 Cardioprotect Noguchi Nhật Bản hỗ trợ tăng sức bền cơ tim & điều hòa huyết áp",
    brand: "Noguchi",
    category: "supplement",
    origin: "Nhật Bản",
    price: 420000,
    original: 480000,
    unit: "Hộp",
    pack: "Hộp 60 Viên",
    image: img("/images/products/prod-coq10.jpg"),
    variants: [{ label: "Hộp 60 Viên", price: 420000 }],
    badges: ["★ CHÍNH HÃNG"],
    short: "Coenzyme Q10 hỗ trợ sản sinh năng lượng cho tế bào cơ tim, tăng sức bền và hỗ trợ điều hòa huyết áp.",
    description:
      "Coenzyme Q10 (CoQ10) là hoạt chất tham gia chuỗi sản xuất năng lượng ATP trong ty thể, đặc biệt quan trọng với các cơ quan tiêu thụ nhiều năng lượng như tim và não. Hàm lượng CoQ10 trong cơ thể giảm dần theo tuổi và khi dùng thuốc nhóm statin.\n\nCardioprotect của Noguchi bổ sung CoQ10 dạng ubiquinone kết hợp vitamin E giúp bảo vệ thành mạch, hỗ trợ cơ tim hoạt động bền bỉ và góp phần điều hòa huyết áp.\n\nCông dụng:\n- Hỗ trợ tăng sức bền cơ tim\n- Chống oxy hóa, bảo vệ thành mạch\n- Giảm mệt mỏi, hồi hộp, đánh trống ngực",
    ingredients: "Coenzyme Q10 (Ubiquinone) 100 mg; Vitamin E 20 mg; Dầu đậu nành, gelatin, glycerin vừa đủ 1 viên nang.",
    usage: "Người lớn uống 1–2 viên/ngày sau bữa ăn có chất béo để hấp thu tốt hơn. Không dùng cho phụ nữ có thai nếu chưa có ý kiến bác sĩ.",
    stock: 150,
    sold: 903,
    flash: { limit: 150, sold: 96 },
    commission: 14,
    rating: 4.9,
    reviews: 77,
  },
  {
    slug: "tam-soat-dot-quy-tieu-chuan",
    sku: "TNSG-PKG-STD",
    name: "Tầm Soát Đột Quỵ Tiêu Chuẩn",
    brand: "",
    category: "package",
    origin: "Việt Nam",
    price: 2500000,
    original: 2900000,
    unit: "Gói",
    pack: "Gói 12 Danh mục khám",
    image: img("/images/products/prod-mri-package.jpg"),
    variants: [
      { label: "Gói tiêu chuẩn", price: 2500000 },
      { label: "Gói VIP", price: 4200000 },
    ],
    badges: ["Gói khám", "Đặt lịch online"],
    short: "Gói 12 danh mục khám tầm soát nguy cơ đột quỵ: huyết áp, mỡ máu, đường huyết, điện tim, siêu âm Doppler động mạch cảnh.",
    description:
      "Gói Tầm Soát Đột Quỵ Tiêu Chuẩn dành cho người từ 40 tuổi hoặc có yếu tố nguy cơ như tăng huyết áp, đái tháo đường, rối loạn mỡ máu, hút thuốc lá.\n\nGói gồm 12 danh mục: khám lâm sàng nội tim mạch, đo huyết áp 24 giờ, điện tâm đồ, siêu âm tim, siêu âm Doppler động mạch cảnh, xét nghiệm mỡ máu, đường huyết, HbA1c, chức năng gan thận, điện giải, công thức máu và đông máu cơ bản.\n\nKết quả được bác sĩ chuyên khoa tim mạch - thần kinh tư vấn trực tiếp, kèm kế hoạch dự phòng cá nhân hóa.\n\nQuyền lợi:\n- Hoàn tất trong khoảng 3 giờ\n- Trả kết quả điện tử trong ngày\n- Tư vấn 1:1 cùng bác sĩ chuyên khoa",
    usage: "Nhịn ăn 8–10 giờ trước khi lấy máu. Mang theo toa thuốc đang dùng và kết quả khám gần nhất. Đặt lịch trước 24 giờ, nhân viên sẽ gọi xác nhận.",
    stock: 500,
    sold: 188,
    commission: 10,
    rating: 4.9,
    reviews: 41,
  },
  {
    slug: "tam-soat-dot-quy-toan-dien-vip",
    sku: "TNSG-PKG-VIP",
    name: "Tầm Soát Đột Quỵ Toàn Diện VIP",
    brand: "",
    category: "package",
    origin: "Việt Nam",
    price: 8900000,
    original: 10200000,
    unit: "Gói VIP",
    pack: "Trọn gói VIP + Xe đưa đón",
    image: img("/images/products/prod-mri-package.jpg"),
    variants: [{ label: "Gói VIP", price: 8900000 }],
    badges: ["Gói khám", "VIP"],
    short: "Trọn gói VIP gồm MRI mạch não, MRA, siêu âm tim qua thực quản, tư vấn chuyên gia đầu ngành và xe đưa đón tận nơi.",
    description:
      "Gói Tầm Soát Đột Quỵ Toàn Diện VIP là chương trình tầm soát cao cấp nhất, kết hợp các kỹ thuật chẩn đoán hình ảnh hiện đại để phát hiện sớm hẹp mạch, phình mạch não và nguồn gây huyết khối từ tim.\n\nGói bao gồm MRI 3.0T sọ não, MRA mạch não - mạch cảnh, CT calcium score, siêu âm tim, Holter điện tim 24 giờ, bộ xét nghiệm tim mạch mở rộng và hội chẩn với chuyên gia đầu ngành.\n\nDịch vụ VIP:\n- Xe đưa đón tận nơi trong nội thành\n- Phòng khám riêng, không chờ đợi\n- Bữa ăn nhẹ sau khi hoàn tất xét nghiệm",
    usage: "Nhịn ăn 8 giờ trước khi khám. Không đeo trang sức kim loại khi chụp MRI. Thông báo cho bác sĩ nếu có máy tạo nhịp hoặc dị vật kim loại trong cơ thể.",
    stock: 200,
    sold: 52,
    commission: 8,
    rating: 5.0,
    reviews: 18,
  },
  {
    slug: "tam-soat-dot-quy-chuyen-sau",
    sku: "TNSG-PKG-MRI",
    name: "Tầm Soát Đột Quỵ Chuyên Sâu",
    brand: "",
    category: "package",
    origin: "Việt Nam",
    price: 4800000,
    original: 5500000,
    unit: "Gói",
    pack: "Gói Chụp MRI 3.0T Mạch Não",
    image: img("/images/products/prod-mri-package.jpg"),
    variants: [
      { label: "Gói tiêu chuẩn", price: 4800000 },
      { label: "Gói VIP", price: 7200000 },
    ],
    badges: ["Gói khám", "MRI 3.0T"],
    short: "Gói chụp MRI 3.0T mạch não kết hợp siêu âm Doppler mạch cảnh, phát hiện sớm hẹp tắc và dị dạng mạch máu não.",
    description:
      "Gói Tầm Soát Đột Quỵ Chuyên Sâu tập trung vào hình ảnh học mạch máu não với máy MRI 3.0 Tesla cho hình ảnh sắc nét, không dùng tia X.\n\nGói gồm MRI sọ não, MRA mạch não, siêu âm Doppler động mạch cảnh - đốt sống, điện tâm đồ và bộ xét nghiệm mỡ máu - đường huyết. Bác sĩ chẩn đoán hình ảnh và bác sĩ thần kinh cùng đọc kết quả.\n\nPhù hợp với người có tiền sử gia đình đột quỵ, đau đầu kéo dài, chóng mặt tái diễn hoặc từng có cơn thiếu máu não thoáng qua.",
    usage: "Nhịn ăn 6 giờ nếu có tiêm thuốc cản quang. Cần có mặt sớm 15 phút để làm thủ tục. Đặt lịch trước ít nhất 24 giờ.",
    stock: 300,
    sold: 97,
    commission: 9,
    rating: 4.9,
    reviews: 33,
  },
  {
    slug: "nattokinase-premium",
    sku: "TNSG-NTK-003",
    name: "Viên Uống Nattokinase Premium 3000FU Orihiro",
    brand: "Orihiro",
    category: "supplement",
    origin: "Nhật Bản",
    price: 680000,
    original: 750000,
    unit: "Hộp",
    pack: "Hộp 60 Viên",
    image: img("/images/products/prod-nattokinase.jpg"),
    variants: [
      { label: "Hộp 60 Viên", price: 680000 },
      { label: "Hộp 120 Viên", price: 1290000 },
    ],
    badges: ["★ CHÍNH HÃNG", "Bán chạy"],
    gift: true,
    short: "Nattokinase 3000FU hỗ trợ làm tan cục máu đông, giảm nguy cơ tắc mạch và hỗ trợ lưu thông tuần hoàn.",
    description:
      "Nattokinase là enzyme chiết xuất từ natto (đậu nành lên men truyền thống của Nhật Bản), được nghiên cứu về khả năng hỗ trợ phân giải fibrin - thành phần chính của cục máu đông.\n\nViên uống Nattokinase Premium 3000FU của Orihiro đạt tiêu chuẩn GMP Nhật Bản, đã loại bỏ vitamin K2 nên phù hợp hơn với người cần theo dõi đông máu (vẫn cần hỏi bác sĩ).\n\nCông dụng:\n- Hỗ trợ giảm hình thành huyết khối\n- Hỗ trợ ổn định huyết áp, tăng lưu thông máu\n- Bảo vệ mạch máu não, tim",
    ingredients: "Nattokinase 3000 FU (60 mg); Tinh bột, cellulose vi tinh thể, magnesi stearat, vỏ nang HPMC.",
    usage: "Uống 1 viên/ngày vào buổi tối, trước khi ngủ 2 giờ hoặc lúc bụng đói. Người đang dùng thuốc chống đông, chuẩn bị phẫu thuật phải tham khảo ý kiến bác sĩ.",
    stock: 120,
    sold: 1540,
    flash: { limit: 100, sold: 71 },
    commission: 18,
    rating: 5.0,
    reviews: 132,
  },
  {
    slug: "citicoline-cdp-choline",
    sku: "TNSG-CTC-004",
    name: "Viên uống Citicoline CDP Choline Nichiei Bussan Nhật Bản hỗ trợ phục hồi dẫn truyền thần kinh não bộ",
    brand: "Nichiei Bussan",
    category: "supplement",
    origin: "Nhật Bản",
    price: 485000,
    original: 580000,
    unit: "Hộp",
    pack: "Hộp 60 Viên",
    image: img("/images/products/prod-citicoline.svg"),
    variants: [{ label: "Hộp 60 Viên", price: 485000 }],
    badges: ["★ CHÍNH HÃNG"],
    short: "Citicoline hỗ trợ phục hồi dẫn truyền thần kinh, cải thiện trí nhớ và chức năng nhận thức sau tai biến.",
    description:
      "Citicoline (CDP-Choline) là chất tham gia tổng hợp phospholipid màng tế bào thần kinh, giúp duy trì cấu trúc và chức năng của nơ-ron. Sản phẩm thường được tham khảo trong chế độ chăm sóc người sau tai biến, người cao tuổi suy giảm trí nhớ.\n\nCông dụng:\n- Hỗ trợ phục hồi dẫn truyền thần kinh não bộ\n- Hỗ trợ cải thiện trí nhớ, sự tập trung\n- Hỗ trợ giảm mệt mỏi thần kinh",
    ingredients: "Citicoline sodium 250 mg; Vitamin B12; Tá dược vừa đủ 1 viên.",
    usage: "Uống 1–2 viên/ngày sau ăn sáng. Dùng theo hướng dẫn của dược sĩ hoặc bác sĩ điều trị.",
    stock: 90,
    sold: 612,
    flash: { limit: 80, sold: 52 },
    commission: 16,
    rating: 4.8,
    reviews: 54,
  },
  {
    slug: "omega-3-epa-dha-orihiro",
    sku: "TNSG-OM3-005",
    name: "Viên uống Dầu cá tinh khiết Omega-3 EPA & DHA Orihiro Nhật Bản hỗ trợ giảm mỡ máu, bền thành mạch",
    brand: "Orihiro",
    category: "supplement",
    origin: "Nhật Bản",
    price: 525000,
    original: 700000,
    unit: "Lọ",
    pack: "Lọ 180 Viên nang mềm",
    image: img("/images/products/prod-omega3.jpg"),
    variants: [{ label: "Lọ 180 Viên nang mềm", price: 525000 }],
    badges: ["★ CHÍNH HÃNG", "Giảm 25%"],
    gift: true,
    short: "Dầu cá tinh khiết giàu EPA & DHA hỗ trợ giảm triglyceride, bền thành mạch và tốt cho tim mạch.",
    description:
      "Omega-3 EPA & DHA là các acid béo thiết yếu mà cơ thể không tự tổng hợp được. Bổ sung đều đặn giúp hỗ trợ giảm triglyceride máu, giảm viêm thành mạch và tốt cho trí não.\n\nDầu cá Orihiro được tinh chế qua công nghệ chưng cất phân tử, loại bỏ kim loại nặng, ít mùi tanh, dễ uống.\n\nCông dụng:\n- Hỗ trợ giảm mỡ máu, bền thành mạch\n- Hỗ trợ tăng cường trí nhớ và thị lực\n- Hỗ trợ giảm nguy cơ xơ vữa động mạch",
    ingredients: "Dầu cá tinh chế (EPA 180 mg, DHA 120 mg trên 1 viên); Gelatin, glycerin, vitamin E.",
    usage: "Uống 3 viên/ngày sau bữa ăn chính. Người dị ứng hải sản không nên sử dụng.",
    stock: 140,
    sold: 1180,
    flash: { limit: 150, sold: 118 },
    commission: 17,
    rating: 4.9,
    reviews: 109,
  },
  {
    slug: "magnesium-vitamin-b-complex-maruman",
    sku: "TNSG-MGB-006",
    name: "Viên uống Magnesium & Vitamin B-Complex Maruman Nhật Bản hỗ trợ ổn định dẫn truyền thần kinh, thư giãn mạch máu",
    brand: "Maruman",
    category: "supplement",
    origin: "Nhật Bản",
    price: 285000,
    unit: "Hộp",
    pack: "Hộp 90 Viên",
    image: img("/images/products/prod-magnesium.svg"),
    variants: [{ label: "Hộp 90 Viên", price: 285000 }],
    badges: ["★ CHÍNH HÃNG"],
    short: "Magie kết hợp vitamin nhóm B hỗ trợ ổn định dẫn truyền thần kinh, thư giãn mạch máu và cải thiện giấc ngủ.",
    description:
      "Magie tham gia hơn 300 phản ứng enzyme, giúp điều hòa trương lực mạch máu và nhịp tim. Kết hợp vitamin B1, B6, B12 giúp nuôi dưỡng hệ thần kinh, giảm căng thẳng và mệt mỏi.\n\nSản phẩm phù hợp với người hay căng thẳng, mất ngủ, chuột rút hoặc người cần hỗ trợ ổn định huyết áp bằng dinh dưỡng.",
    ingredients: "Magnesi oxid; Vitamin B1, B2, B6, B12; Acid folic; Niacin; Biotin.",
    usage: "Uống 2–3 viên/ngày sau bữa ăn. Người suy thận cần hỏi bác sĩ trước khi dùng.",
    stock: 200,
    sold: 436,
    flash: { limit: 120, sold: 38 },
    commission: 12,
    rating: 4.8,
    reviews: 37,
  },
  {
    slug: "omron-hem-7120",
    sku: "TNSG-OMR-7120",
    name: "Máy đo huyết áp bắp tay tự động Omron HEM-7120 Nhật Bản cảnh báo rối loạn nhịp tim & tăng huyết áp",
    brand: "Omron",
    category: "device",
    origin: "Nhật Bản",
    price: 890000,
    original: 1050000,
    unit: "Cái",
    pack: "Máy + Vòng bít + Adapter",
    image: img("/images/products/prod-omron-bp.jpg"),
    variants: [{ label: "Máy + Vòng bít + Adapter", price: 890000 }],
    badges: ["★ CHÍNH HÃNG", "Bảo hành 5 năm"],
    gift: true,
    short: "Omron HEM-7120 đo tự động, cảnh báo nhịp tim không đều và tăng huyết áp, màn hình lớn dễ đọc.",
    description:
      "Omron HEM-7120 là máy đo huyết áp bắp tay thế hệ mới với màn hình hiển thị lớn, chỉ báo mức huyết áp theo thang đo của Tổ chức Y tế Thế giới và biểu tượng cảnh báo rối loạn nhịp tim (IHB).\n\nMáy được kiểm chứng lâm sàng, phù hợp cho người cao tuổi theo dõi huyết áp tại nhà mỗi ngày.",
    usage: "Ngồi thẳng lưng, chân chạm đất, nghỉ 5 phút trước khi đo. Đo 2 lần cách nhau 1–2 phút và lấy giá trị trung bình.",
    stock: 80,
    sold: 355,
    commission: 8,
    rating: 4.9,
    reviews: 59,
  },
  {
    slug: "may-do-ecg-afib-cam-tay",
    sku: "TNSG-ECG-AF1",
    name: "Máy đo điện tim cầm tay phát hiện Rung nhĩ (AFib) kết nối điện thoại",
    brand: "Omron",
    category: "device",
    origin: "Nhật Bản",
    price: 3290000,
    original: 3790000,
    unit: "Cái",
    pack: "Máy + Dây sạc + Hộp đựng",
    image: img("/images/products/prod-omron-bp.jpg"),
    variants: [{ label: "Máy + Dây sạc + Hộp đựng", price: 3290000 }],
    badges: ["Máy đo AFib", "Mới"],
    short: "Thiết bị đo điện tim 1 chuyển đạo, phát hiện nhanh dấu hiệu rung nhĩ trong 30 giây, đồng bộ ứng dụng trên điện thoại.",
    description:
      "Máy đo ECG cầm tay giúp người có nguy cơ rung nhĩ chủ động ghi điện tim ngay khi hồi hộp, đánh trống ngực. Kết quả hiển thị nhịp xoang bình thường hoặc nghi ngờ rung nhĩ và có thể chia sẻ với bác sĩ.\n\nLưu ý: thiết bị chỉ hỗ trợ sàng lọc, không thay thế chẩn đoán của bác sĩ chuyên khoa tim mạch.",
    usage: "Đặt hai ngón tay lên hai điện cực, giữ yên 30 giây, không nói chuyện. Đo khi có triệu chứng và định kỳ mỗi ngày theo hướng dẫn của bác sĩ.",
    stock: 40,
    sold: 74,
    commission: 8,
    rating: 4.8,
    reviews: 22,
  },
];

const ARTICLES = [
  {
    slug: "phan-biet-dot-quy-thieu-mau-nao-xuat-huyet-nao-va-tia",
    title: "Phân biệt Đột quỵ Nhồi máu não, Xuất huyết não và Cơn thiếu máu não thoáng qua (TIA)",
    topic: "overview",
    label: "Tổng quan & Phân loại",
    excerpt: "85% ca đột quỵ là nhồi máu não do tắc mạch, 15% do vỡ mạch xuất huyết não. Hiểu đúng bản chất từng thể bệnh giúp tránh sai lầm chí mạng khi xử trí ban đầu.",
    image: img("/images/hero/lc-subbanner-screening.jpg"),
    minutes: 5,
    reviewer: "Hội đồng Chuyên môn Tim mạch – Đột quỵ",
    keys: [
      "Khoảng 85% ca đột quỵ là nhồi máu não (tắc mạch), khoảng 15% là xuất huyết não (vỡ mạch).",
      "TIA là cơn thiếu máu não thoáng qua, triệu chứng tự hết trong vài phút nhưng là cảnh báo đỏ của đột quỵ thật sự.",
      "Mọi trường hợp nghi ngờ đều phải gọi 115 ngay, không chờ đợi xem triệu chứng có tự khỏi hay không.",
    ],
    body: `<p>Đột quỵ (tai biến mạch máu não) xảy ra khi dòng máu nuôi một vùng não bị gián đoạn đột ngột, khiến tế bào thần kinh thiếu oxy và chết đi nhanh chóng. Tuy cùng gọi là đột quỵ nhưng có ba tình huống khác nhau về cơ chế và cách xử trí.</p>
<h2>1. Nhồi máu não - khi mạch máu bị tắc</h2>
<p>Đây là thể gặp nhiều nhất, chiếm khoảng 85% các ca. Cục máu đông hình thành tại chỗ trên nền mảng xơ vữa, hoặc từ tim (nhất là ở người rung nhĩ) trôi lên não làm tắc động mạch. Vùng não phía sau chỗ tắc thiếu máu và bắt đầu tổn thương không hồi phục sau vài phút.</p>
<p>Điểm quan trọng: nếu được đưa đến bệnh viện có đơn vị đột quỵ trong "giờ vàng" 3 – 4,5 giờ đầu, người bệnh có thể được dùng thuốc tiêu sợi huyết hoặc can thiệp lấy huyết khối, làm tăng đáng kể cơ hội hồi phục.</p>
<h2>2. Xuất huyết não - khi mạch máu bị vỡ</h2>
<p>Chiếm khoảng 15% nhưng thường nặng hơn. Mạch máu não bị vỡ do huyết áp tăng cao đột ngột, phình mạch hoặc dị dạng mạch. Máu tràn vào mô não gây chèn ép và tăng áp lực nội sọ. Người bệnh thường đau đầu dữ dội, nôn, rối loạn ý thức.</p>
<p>Với thể này tuyệt đối không dùng thuốc tiêu sợi huyết. Vì vậy chỉ chụp CT hoặc MRI sọ não tại bệnh viện mới phân biệt chắc chắn được hai thể. Đây là lý do không nên tự ý cho uống aspirin hay bất kỳ loại thuốc nào tại nhà.</p>
<h2>3. Cơn thiếu máu não thoáng qua (TIA)</h2>
<p>TIA là tình trạng mạch máu não bị tắc tạm thời, triệu chứng giống đột quỵ (méo miệng, yếu tay chân, nói khó) nhưng tự hết trong vài phút đến dưới 24 giờ. Nhiều người chủ quan bỏ qua, trong khi khoảng 1/5 người bị TIA có thể bị đột quỵ thật sự trong vòng 90 ngày, nguy cơ cao nhất ở 48 giờ đầu.</p>
<p>Hãy xem TIA là một "cuộc báo động cuối cùng": cần đi khám ngay để tìm nguyên nhân và điều trị dự phòng.</p>`,
  },
  {
    slug: "kiem-soat-tang-huyet-ap-yeu-to-nguy-co-so-1",
    title: 'Tăng huyết áp: "Kẻ giết người thầm lặng" đứng sau hơn 50% ca đột quỵ',
    topic: "conditions",
    label: "Kiểm soát Bệnh nền",
    excerpt: "Kiểm soát tốt huyết áp tâm thu dưới 130/80 mmHg theo khuyến cáo bác sĩ giúp giảm tới 35–40% nguy cơ tai biến mạch máu não.",
    image: img("/images/hero/lc-short-bp-check.jpg"),
    minutes: 4,
    reviewer: "Chuyên khoa Nội Tim mạch",
    keys: [
      "Huyết áp ≥ 140/90 mmHg kéo dài làm tổn thương lớp nội mạc động mạch, thúc đẩy mảng xơ vữa và phình mạch não.",
      "Tuyệt đối không tự ý ngưng thuốc huyết áp khi thấy huyết áp đã về bình thường.",
      "Đo huyết áp tại nhà 2 lần/ngày (sáng sau khi thức dậy và tối trước khi ngủ) với tư thế ngồi nghỉ 5 phút.",
    ],
    body: `<p>Tăng huyết áp thường không có triệu chứng rõ ràng nên nhiều người chỉ phát hiện khi đã xảy ra biến chứng. Đây là yếu tố nguy cơ có thể điều chỉnh quan trọng nhất của đột quỵ, đứng sau hơn một nửa số ca nhồi máu não và xuất huyết não.</p>
<h2>1. Cơ chế huyết áp cao gây tắc và vỡ mạch não</h2>
<p>Khi áp lực máu lên thành động mạch tăng kéo dài, lớp nội mạc bị tổn thương, cholesterol lắng đọng hình thành mảng xơ vữa làm hẹp lòng mạch. Mảng xơ vữa có thể nứt vỡ, kích hoạt cục máu đông gây tắc mạch (nhồi máu não).</p>
<p>Đồng thời, các mạch máu nhỏ trong não chịu áp lực lớn liên tục trở nên giòn, dễ phình và vỡ, gây xuất huyết não. Mục tiêu điều trị cho phần lớn người trưởng thành là huyết áp dưới 130/80 mmHg, do bác sĩ chỉ định cụ thể theo từng người.</p>
<h2>2. Quy tắc đo huyết áp chuẩn tại nhà cho người trên 50 tuổi</h2>
<p>Dùng máy đo bắp tay đã được kiểm chuẩn, không dùng máy đo cổ tay nếu không cần thiết. Ngồi nghỉ 5 phút, lưng tựa ghế, chân chạm sàn, tay đặt ngang tim, không nói chuyện, không dùng cà phê hoặc thuốc lá trước đó 30 phút.</p>
<p>Đo 2 lần mỗi buổi cách nhau 1–2 phút, ghi lại vào sổ theo dõi. Mang sổ này khi đi tái khám để bác sĩ điều chỉnh thuốc phù hợp. Nếu huyết áp tâm thu từ 180 mmHg trở lên kèm đau đầu dữ dội, nói khó, yếu liệt: gọi 115 ngay.</p>
<ul><li>Giảm muối dưới 5 g/ngày (khoảng 1 muỗng cà phê)</li><li>Tăng rau xanh, trái cây giàu kali theo chế độ DASH</li><li>Duy trì cân nặng hợp lý, hạn chế rượu bia</li></ul>`,
  },
  {
    slug: "rung-nhi-va-nguy-co-huyet-khoi-tu-tim-len-nao",
    title: "Rung nhĩ (AFib) làm tăng gấp 5 lần nguy cơ đột quỵ nặng như thế nào?",
    topic: "conditions",
    label: "Kiểm soát Bệnh nền",
    excerpt: "Khi tâm nhĩ rung hỗn loạn thay vì co bóp nhịp nhàng, máu ứ đọng tại tiểu nhĩ trái tạo cục máu đông lớn trôi thẳng lên động mạch não.",
    image: img("/images/hero/lc-healthcheck-doctors.jpg"),
    minutes: 5,
    reviewer: "Chuyên khoa Nhịp tim học",
    keys: [
      "Rung nhĩ làm tăng nguy cơ đột quỵ khoảng 5 lần, và đột quỵ do rung nhĩ thường nặng hơn.",
      "Thang điểm CHA₂DS₂-VASc giúp ước tính nguy cơ huyết khối và nhu cầu dùng thuốc chống đông.",
      "Không tự ý dùng hoặc ngưng thuốc chống đông khi chưa có chỉ định của bác sĩ.",
    ],
    body: `<p>Rung nhĩ là rối loạn nhịp tim thường gặp nhất, đặc biệt ở người trên 65 tuổi. Nhiều người không có triệu chứng, một số có cảm giác hồi hộp, đánh trống ngực, mệt, khó thở khi gắng sức.</p>
<h2>1. Vì sao rung nhĩ gây đột quỵ?</h2>
<p>Ở người bình thường, tâm nhĩ co bóp nhịp nhàng đẩy máu xuống tâm thất. Khi rung nhĩ, tâm nhĩ run lên hỗn loạn, máu ứ đọng nhất là ở tiểu nhĩ trái và dễ hình thành cục máu đông. Cục máu đông này có thể bị đẩy ra theo dòng máu lên não gây tắc động mạch lớn, dẫn đến nhồi máu não rộng và nặng.</p>
<h2>2. Ai cần tầm soát rung nhĩ?</h2>
<p>Người từ 65 tuổi trở lên, người tăng huyết áp, đái tháo đường, suy tim, bệnh van tim, ngưng thở khi ngủ hoặc béo phì nên được kiểm tra mạch và điện tim định kỳ. Các thiết bị đo huyết áp có báo nhịp không đều hoặc máy ECG cầm tay có thể giúp phát hiện nghi ngờ sớm.</p>
<h2>3. Điều trị dự phòng đột quỵ</h2>
<p>Dựa vào điểm CHA₂DS₂-VASc, bác sĩ sẽ cân nhắc thuốc chống đông đường uống để ngăn cục máu đông. Việc dùng thuốc phải đều đặn, đúng liều và theo dõi tái khám. Quên thuốc hoặc tự ngưng thuốc là nguyên nhân thường gặp của đột quỵ tái phát.</p>`,
  },
  {
    slug: "dai-thao-duong-va-roi-loan-mo-mau-bo-doi-xo-vua-mach",
    title: "Đái tháo đường & Mỡ máu LDL-C cao: Bộ đôi thúc đẩy xơ vữa động mạch cảnh",
    topic: "conditions",
    label: "Kiểm soát Bệnh nền",
    excerpt: "Người mắc đái tháo đường có nguy cơ đột quỵ cao gấp 2–4 lần. Kiểm soát đồng thời HbA1c và LDL-Cholesterol là chìa khóa bảo vệ mạch máu não.",
    image: img("/images/hero/lc-health-campaign.jpg"),
    minutes: 4,
    reviewer: "Chuyên khoa Nội tiết – Đái tháo đường",
    keys: [
      "Đường huyết cao kéo dài làm tổn thương thành mạch, đẩy nhanh quá trình xơ vữa.",
      "LDL-C cao là nguyên nhân chính của mảng xơ vữa; mục tiêu LDL-C do bác sĩ đặt theo mức nguy cơ cá nhân.",
      "Xét nghiệm HbA1c và mỡ máu mỗi 3–6 tháng nếu đã mắc bệnh.",
    ],
    body: `<p>Đái tháo đường và rối loạn mỡ máu thường đi cùng nhau trong hội chứng chuyển hóa. Cả hai đều âm thầm làm tổn thương thành mạch nhiều năm trước khi gây đột quỵ hoặc nhồi máu cơ tim.</p>
<h2>1. Tác động lên động mạch cảnh và mạch não</h2>
<p>Đường huyết cao làm gia tăng quá trình glycat hóa và viêm ở lớp nội mạc. LDL-Cholesterol bị oxy hóa lắng đọng ở thành mạch, hình thành mảng xơ vữa tại chỗ chia nhánh của động mạch cảnh. Mảng xơ vữa to dần gây hẹp, hoặc nứt vỡ sinh huyết khối trôi lên não.</p>
<h2>2. Mục tiêu kiểm soát</h2>
<p>Người đái tháo đường thường được khuyến cáo duy trì HbA1c khoảng 7% (cá thể hóa theo tuổi và bệnh đi kèm) và LDL-C thấp hơn mức dành cho người bình thường. Việc dùng statin, thay đổi dinh dưỡng, tập luyện đều đặn giúp giảm đáng kể nguy cơ biến cố tim mạch.</p>
<p>Siêu âm Doppler động mạch cảnh mỗi 1–2 năm giúp phát hiện sớm mảng xơ vữa, nhất là ở người trên 50 tuổi hoặc có nhiều yếu tố nguy cơ.</p>`,
  },
  {
    slug: "8-nguyen-tac-vang-lifes-essential-8-bao-ve-mach-mau",
    title: "8 Nguyên tắc Vàng Life's Essential 8 của Hiệp hội Tim mạch Hoa Kỳ (AHA)",
    topic: "lifestyle",
    label: "Dinh dưỡng & Lối sống",
    excerpt: "Chỉ cần duy trì 150 phút vận động/tuần, giảm lượng muối dưới 5g/ngày, bỏ thuốc lá và ngủ đủ 7–8 tiếng giúp giảm tới 80% ca đột quỵ có thể phòng ngừa.",
    image: img("/images/hero/lc-healthcheck-doctors.jpg"),
    minutes: 6,
    reviewer: "Chuyên gia Dinh dưỡng & Dự phòng",
    keys: [
      "Life's Essential 8 gồm 4 hành vi (ăn uống, vận động, không thuốc lá, ngủ) và 4 chỉ số (BMI, mỡ máu, đường huyết, huyết áp).",
      "Điểm càng cao, nguy cơ bệnh tim mạch và đột quỵ càng thấp.",
      "Bắt đầu từ thay đổi nhỏ: đi bộ nhanh 30 phút, 5 ngày mỗi tuần.",
    ],
    body: `<p>Life's Essential 8 (LE8) là bộ chỉ số do Hiệp hội Tim mạch Hoa Kỳ công bố năm 2022 để đánh giá và cải thiện sức khỏe tim mạch. Mỗi chỉ số được chấm từ 0 đến 100, điểm trung bình thể hiện mức độ "sức khỏe tim mạch lý tưởng".</p>
<h2>1. Bốn hành vi sống</h2>
<p><strong>Ăn uống lành mạnh</strong> theo mô hình DASH hoặc Địa Trung Hải: nhiều rau, trái cây, ngũ cốc nguyên hạt, cá; hạn chế thịt chế biến, đồ ngọt và muối. <strong>Vận động</strong> ít nhất 150 phút mỗi tuần ở cường độ vừa. <strong>Không hút thuốc</strong> lá, kể cả thuốc lá điện tử. <strong>Ngủ đủ</strong> 7–9 giờ mỗi đêm.</p>
<h2>2. Bốn chỉ số sinh học</h2>
<p>Kiểm soát <strong>cân nặng</strong> (BMI dưới 25 với người châu Á là mục tiêu thực tế), <strong>mỡ máu</strong> (non-HDL cholesterol), <strong>đường huyết</strong> (HbA1c dưới 5,7%) và <strong>huyết áp</strong> dưới 120/80 mmHg nếu có thể.</p>
<h2>3. Bắt đầu từ đâu?</h2>
<p>Hãy làm bài đánh giá toàn diện của TN Stroke Guard để biết điểm LE8 hiện tại của bạn, sau đó chọn một mục tiêu nhỏ cho tháng này. Thay đổi đều đặn quan trọng hơn thay đổi quá mạnh rồi bỏ cuộc.</p>`,
  },
  {
    slug: "cham-soc-phuc-hoi-chuc-nang-6-thang-dau-sau-dot-quy",
    title: "Lộ trình phục hồi chức năng 6 tháng đầu sau đột quỵ & Phòng ngừa tái phát",
    topic: "recovery",
    label: "Phục hồi Sau Đột quỵ",
    excerpt: "3 đến 6 tháng đầu sau tai biến là giai đoạn tính mềm dẻo thần kinh cao nhất.",
    image: img("/images/prevention/prev-seniors.jpg"),
    minutes: 5,
    reviewer: "Chuyên khoa Phục hồi chức năng",
    keys: [
      "Tập phục hồi chức năng nên bắt đầu sớm ngay khi tình trạng ổn định, theo chỉ định của bác sĩ.",
      "3–6 tháng đầu là giai đoạn não có khả năng tái tổ chức (tính mềm dẻo thần kinh) cao nhất.",
      "Dùng thuốc dự phòng thứ phát đều đặn và kiểm soát huyết áp, đường huyết, mỡ máu để tránh tái phát.",
    ],
    body: `<p>Sau đột quỵ, nhiều người bệnh và gia đình nghĩ rằng phần việc quan trọng nhất đã kết thúc khi xuất viện. Thực tế, quá trình phục hồi mới là giai đoạn quyết định mức độ độc lập trong sinh hoạt về sau.</p>
<h2>1. Giai đoạn vàng của phục hồi</h2>
<p>Trong 3 đến 6 tháng đầu, não có khả năng "tái tổ chức" mạnh nhất, các vùng não lành có thể đảm nhận một phần chức năng của vùng tổn thương. Luyện tập lặp đi lặp lại, đúng kỹ thuật giúp củng cố các kết nối thần kinh mới.</p>
<h2>2. Chương trình tập luyện</h2>
<p>Vật lý trị liệu cải thiện sức cơ, thăng bằng và dáng đi. Hoạt động trị liệu giúp người bệnh tự ăn, mặc áo, vệ sinh cá nhân. Ngôn ngữ trị liệu hỗ trợ người nói khó hoặc nuốt nghẹn. Người nhà cần được hướng dẫn cách lật trở, di chuyển để tránh loét tỳ đè và ngã.</p>
<h2>3. Phòng ngừa tái phát</h2>
<p>Khoảng 1/4 người từng đột quỵ có thể bị tái phát. Tuân thủ thuốc kháng kết tập tiểu cầu hoặc chống đông, kiểm soát huyết áp, đường huyết, mỡ máu, bỏ thuốc lá và tái khám định kỳ là các việc không thể thiếu. Theo dõi tâm trạng vì trầm cảm sau đột quỵ khá phổ biến và có thể điều trị.</p>`,
  },
];

const VIDEOS = [
  ["Tăng huyết áp sáng sớm: Vì sao dễ kích hoạt cơn đột quỵ?", "RADAR SỨC KHỎE", "TĂNG ÁP SÁNG SỚM", "Vì sao dễ kích hoạt cơn đột quỵ?", "/images/hero/lc-short-bp-check.jpg"],
  ["Cơn tê yếu 5 phút: Cảnh báo đỏ trước đột quỵ thật sự!", "RADAR SỨC KHỎE", "CƠN TÊ YẾU 5 PHÚT", "Cảnh báo đỏ trước đột quỵ thật sự!", "/images/hero/lc-subbanner-screening.jpg"],
  ["Người bị rung nhĩ nguy cơ đột quỵ tăng gấp mấy lần?", "2 PHÚT BÁC SĨ", "NGƯỜI BỊ RUNG NHĨ NGUY CƠ ĐỘT QUỴ TĂNG GẤP MẤY LẦN?", "Người bị rung nhĩ (AFib) có nguy cơ đột quỵ cao gấp mấy lần?", "/images/hero/lc-healthcheck-doctors.jpg"],
  ["Nghi đột quỵ có nên ngậm thuốc hạ áp tại nhà?", "2 PHÚT BÁC SĨ", "NGHI ĐỘT QUỴ CÓ NÊN NGẬM THUỐC HẠ ÁP TẠI NHÀ?", "Nghi ngờ đột quỵ cấp có nên tự ngậm thuốc hạ huyết áp tại nhà?", "/images/hero/lc-health-campaign.jpg"],
  ["Chỉ số mỡ máu LDL bao nhiêu dễ gây hẹp mạch cảnh?", "2 PHÚT BÁC SĨ", "CHỈ SỐ MỠ MÁU LDL BAO NHIÊU DỄ GÂY HẸP MẠCH CẢNH?", "Chỉ số mỡ máu xấu LDL-C bao nhiêu cần siêu âm động mạch cảnh?", "/images/prevention/prev-middle-age.jpg"],
  ["Chích máu 10 đầu ngón tay khi đột quỵ: Đúng hay sai?", "2 PHÚT BÁC SĨ", "CHÍCH MÁU 10 ĐẦU NGÓN TAY KHI ĐỘT QUỴ: ĐÚNG HAY SAI?", "Chích máu 10 đầu ngón tay khi gặp người đột quỵ: Đúng hay sai lầm?", "/images/prevention/prev-seniors.jpg"],
  ["Giảm một nửa muối mỗi ngày hạ được bao nhiêu mmHg?", "2 PHÚT BÁC SĨ", "GIẢM BỚT MỘT NỬA MUỐI MỖI NGÀY HẠ ĐƯỢC BAO NHIÊU MMHG?", "Ăn nhạt giảm muối theo chế độ DASH giúp hạ huyết áp ra sao?", "/images/prevention/prev-young-adult.jpg"],
  ["Phục hồi vận động 6 tháng đầu: Tập thế nào cho đúng?", "RADAR SỨC KHỎE", "PHỤC HỒI VẬN ĐỘNG 6 THÁNG ĐẦU", "Tập thế nào cho đúng để não phục hồi tốt nhất?", "/images/prevention/prev-children.jpg"],
];

export function seedStore(db: DatabaseSync) {
  const insCat = db.prepare("INSERT INTO categories (slug, name, description, sort) VALUES (?, ?, ?, ?)");
  insCat.run("supplement", "Thực phẩm chức năng", "Thực phẩm bảo vệ sức khỏe mạch não, tim mạch chính hãng Nhật Bản", 1);
  insCat.run("package", "Gói khám tầm soát", "Gói khám tầm soát nguy cơ đột quỵ, MRI mạch não", 2);
  insCat.run("device", "Trang thiết bị y tế & Máy đo AFib", "Máy đo huyết áp, máy đo điện tim phát hiện rung nhĩ", 3);

  const insP = db.prepare(
    `INSERT INTO products (slug, sku, name, brand, category, price, original_price, unit, pack_size, image, gallery, variants, badges,
       has_gift, origin, rating, review_count, short_description, description, ingredients, usage, stock, sold_count,
       flash_sale, flash_limit, flash_sold, featured, commission_rate, status, sort)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'active',?)`,
  );
  PRODUCTS.forEach((p, i) => {
    insP.run(
      p.slug, p.sku, p.name, p.brand, p.category, p.price, p.original ?? null, p.unit, p.pack, p.image,
      JSON.stringify(p.gallery ?? [p.image]), JSON.stringify(p.variants), JSON.stringify(p.badges),
      p.gift ? 1 : 0, p.origin, p.rating, p.reviews, p.short, p.description, p.ingredients ?? null, p.usage ?? null,
      p.stock, p.sold, p.flash ? 1 : 0, p.flash?.limit ?? 0, p.flash?.sold ?? 0, p.featured === false ? 0 : 1,
      p.commission, i + 1,
    );
  });

  const insA = db.prepare(
    `INSERT INTO articles (slug, title, topic, topic_label, excerpt, image, hero_kicker, hero_title, hero_subtitle, body, author, reviewer, read_minutes, key_points, status, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'published',?)`,
  );
  ARTICLES.forEach((a, i) => {
    const d = new Date(Date.UTC(2026, 5, 8 - i * 3, 3, 0, 0)).toISOString().slice(0, 19).replace("T", " ");
    insA.run(a.slug, a.title, a.topic, a.label, a.excerpt, a.image, a.label.toUpperCase(), a.title, a.excerpt, a.body,
      "Hội đồng Chuyên gia TN Stroke Guard", a.reviewer, a.minutes, JSON.stringify(a.keys), d);
  });

  const insV = db.prepare(
    "INSERT INTO videos (title, tag, overlay_title, overlay_subtitle, image, url, sort) VALUES (?,?,?,?,?,NULL,?)",
  );
  VIDEOS.forEach((v, i) => insV.run(v[0], v[1], v[2], v[3], img(v[4]), i + 1));

  const set = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
  const settings: Record<string, string> = {
    hotline: "1900 6789",
    hotline_hours: "8:00-22:00",
    pharmacist_hotline: "1900 1234",
    zalo_url: "https://zalo.me/0933991990",
    flash_start_hour: "8",
    flash_end_hour: "22",
    free_ship_threshold: "500000",
    shipping_fee: "30000",
    bank_name: "Vietcombank - CN Sài Gòn",
    bank_account: "0071001234567",
    bank_holder: "CONG TY TNMALL PHARMACY",
    home_featured: JSON.stringify([
      { kicker: "TN STROKE GUARD · FRAMINGHAM · AHA LE8", heading: "Vì Trái Tim & Trí Não Việt Nam", subheading: "CHỦ ĐỘNG TẦM SOÁT SỚM — KHÔNG CÒN NỖI LO ĐỘT QUỴ", tag: "Truyền thông Y khoa", body: "TN Stroke Guard cùng Hội đồng Chuyên gia Tim mạch – Thần kinh triển khai chương trình tầm soát sớm nguy cơ đột quỵ 10 năm miễn phí cho cộng đồng", image: "/images/hero/lc-health-campaign.jpg", href: "/assessment/general" },
      { kicker: "KIỂM SOÁT HUYẾT ÁP", heading: "ĐO ĐÚNG GIỜ AN TÂM MẠCH NÃO", tag: "Tin tức sức khỏe", body: "“Bác sĩ ngay đây, An tâm mạch não!”: Hướng dẫn kiểm soát huyết áp dưới 130/80 mmHg giảm 40% nguy cơ đột quỵ", image: "/images/hero/lc-short-bp-check.jpg", href: "/education/kiem-soat-tang-huyet-ap-yeu-to-nguy-co-so-1" },
      { kicker: "TẦM SOÁT RUNG NHĨ", heading: "NGỪA CỤC MÁU ĐÔNG TỪ TIM LÊN NÃO", tag: "Phòng chữa bệnh", body: "Chủ động sàng lọc sớm Rung nhĩ (AFib) & huyết khối từ tim bằng thang đo quốc tế CHA₂DS₂-VASc ngay tại nhà", image: "/images/hero/lc-healthcheck-doctors.jpg", href: "/assessment/afib" },
      { kicker: "BỆNH LÝ NỀN", heading: "KIỂM SOÁT ĐƯỜNG HUYẾT & MỠ MÁU", tag: "Người cao tuổi", body: "Đái tháo đường và LDL-C cao thúc đẩy xơ vữa động mạch cảnh: cách kiểm soát hiệu quả", image: "/images/prevention/prev-seniors.jpg", href: "/education/dai-thao-duong-va-roi-loan-mo-mau-bo-doi-xo-vua-mach" },
      { kicker: "DINH DƯỠNG DỰ PHÒNG", heading: "8 NGUYÊN TẮC VÀNG BẢO VỆ MẠCH MÁU", tag: "Dinh dưỡng", body: "Life's Essential 8 của AHA: vận động, ăn uống, giấc ngủ và các chỉ số cần theo dõi", image: "/images/prevention/prev-middle-age.jpg", href: "/education/8-nguyen-tac-vang-lifes-essential-8-bao-ve-mach-mau" },
      { kicker: "CHĂM SÓC SAU TAI BIẾN", heading: "PHỤC HỒI VẬN ĐỘNG 6 THÁNG ĐẦU", tag: "Phục hồi sau tai biến", body: "Lộ trình phục hồi chức năng giúp người bệnh sớm trở lại sinh hoạt độc lập", image: "/images/prevention/prev-children.jpg", href: "/education/cham-soc-phuc-hoi-chuc-nang-6-thang-dau-sau-dot-quy" },
    ].map((x) => ({ ...x, image: img(x.image) }))),
  };
  for (const [k, v] of Object.entries(settings)) set.run(k, v);
}
