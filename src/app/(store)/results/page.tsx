import { PageHead } from "@/components/store/PageHead";
import { ResultsLookup } from "@/components/store/ResultsClient";

export const metadata = { title: "Kết quả tầm soát — TNStrokeGuard" };

export default function ResultsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead code="PH-02.3 · Hồ sơ & Tra cứu Báo cáo" title="Tra Cứu & Lịch Sử Phiên Tầm Soát" sub="Dữ liệu phiên được lưu tạm thời bảo mật trên trình duyệt của bạn." />
      <ResultsLookup />
    </div>
  );
}
