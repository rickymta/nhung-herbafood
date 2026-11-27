import { listAssessments } from "@/lib/admin/misc";
import { Badge, Card, Kpi, PageHeader, Pagination } from "@/components/admin/ui";
import { FilterForm } from "@/components/admin/client";
import { Donut } from "@/components/admin/charts";
import { dateVN, num } from "@/lib/format";
import { maskPhone, type SP, sp1 } from "@/lib/admin/common";
import { HeartPulse, Activity } from "lucide-react";

const RISK: Record<string, [string, "green" | "amber" | "red"]> = { low: ["Thấp", "green"], moderate: ["Trung bình", "amber"], high: ["Cao", "red"] };
const TYPE: Record<string, string> = { general: "Nguy cơ đột quỵ 10 năm", afib: "Sàng lọc rung nhĩ" };

export default async function AssessmentsPage({ searchParams }: PageProps<"/admin/assessments">) {
  const sp = (await searchParams) as SP;
  const { rows, pg, dist, byType, total } = listAssessments(sp);
  const n = (k: string) => dist.find((d) => d.k === k)?.n ?? 0;
  return (
    <>
      <PageHeader title="Đánh giá nguy cơ" sub="Kết quả bài đánh giá nguy cơ đột quỵ / rung nhĩ do khách thực hiện trên cửa hàng" />
      <div className="adm-grid adm-g4">
        <Kpi label="Tổng lượt đánh giá" value={total} icon={<HeartPulse size={18} />} sub="Từ storefront" />
        <Kpi label="Nguy cơ cao" value={n("high")} icon={<Activity size={18} />} sub="Cần tư vấn ưu tiên" />
        <Kpi label="Nguy cơ trung bình" value={n("moderate")} icon={<Activity size={18} />} sub="Theo dõi" />
        <Kpi label="Nguy cơ thấp" value={n("low")} icon={<Activity size={18} />} sub={byType.map((b) => `${TYPE[b.k] ?? b.k}: ${b.n}`).join(" · ") || "—"} />
      </div>
      <div className="adm-grid adm-g21">
        <div>
          <FilterForm action="/admin/assessments">
            <input className="adm-input" name="q" defaultValue={sp1(sp.q)} placeholder="Tìm tên, SĐT, mã…" />
            <select className="adm-select" name="type" defaultValue={sp1(sp.type)}><option value="">Loại bài test</option>{Object.entries(TYPE).map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
            <select className="adm-select" name="risk" defaultValue={sp1(sp.risk)}><option value="">Mức nguy cơ</option>{Object.entries(RISK).map(([a, b]) => <option key={a} value={a}>{b[0]}</option>)}</select>
          </FilterForm>
          <Card flush>
            <div className="adm-tblwrap"><table className="adm-tbl"><thead><tr><th>Mã</th><th>Loại</th><th>Người làm test</th><th>SĐT</th><th className="r">Điểm</th><th>Nguy cơ</th><th>Thời gian</th></tr></thead>
              <tbody>{rows.map((a) => (
                <tr key={a.id}><td><code>{a.code}</code></td><td>{TYPE[a.type] ?? a.type}</td><td>{a.name || <span className="mut">Ẩn danh</span>}</td><td>{maskPhone(a.phone) || "—"}</td><td className="r">{num(a.score, 1)}</td>
                  <td><Badge tone={RISK[a.risk_level]?.[1] ?? "gray"}>{RISK[a.risk_level]?.[0] ?? a.risk_level}</Badge></td><td>{dateVN(a.created_at, true)}</td></tr>))}
                {!rows.length && <tr><td colSpan={7} style={{ textAlign: "center", padding: 28, color: "var(--muted)" }}>Chưa có lượt đánh giá nào. Dữ liệu sẽ xuất hiện khi khách làm bài test trên cửa hàng.</td></tr>}</tbody></table></div>
            <Pagination pg={pg} base="/admin/assessments" sp={sp} noun="lượt đánh giá" />
          </Card>
        </div>
        <Card title="Phân bổ mức nguy cơ">
          <Donut center={num(total)} sub="Lượt đánh giá" items={[{ name: "Thấp", value: n("low"), color: "#10b981" }, { name: "Trung bình", value: n("moderate"), color: "#f59e0b" }, { name: "Cao", value: n("high"), color: "#ef4444" }]} />
        </Card>
      </div>
    </>
  );
}
