import { commissionKpis, currentPeriod, reconcile } from "@/lib/admin/finance";
import { Kpi, PageHeader } from "@/components/admin/ui";
import { Coins, Clock, Wallet, BadgeCheck } from "lucide-react";
import PaymentsView from "@/components/admin/PaymentsView";
import { ReconcileAlerts } from "@/components/admin/ReconcileAlerts";
import type { SP } from "@/lib/admin/common";

export default async function PaymentsPage({ searchParams }: PageProps<"/admin/payments">) {
  const sp = (await searchParams) as SP;
  const k = commissionKpis();
  const icons = [Coins, Clock, Wallet, BadgeCheck];
  return (
    <>
      <PageHeader title="Hoa hồng, đối soát & thanh toán" sub={`Tính toán, kiểm tra và chi trả hoa hồng cho đối tác · Kỳ hiện tại: ${currentPeriod()}`} />
      <div className="adm-grid adm-g4">{k.map((x, i) => { const I = icons[i]; return <Kpi key={x.label} label={x.label} kind="vnd" value={x.value} delta={x.delta} icon={<I size={18} />} deltaLabel="so với 30 ngày trước" />; })}</div>
      <PaymentsView base="/admin/payments" sp={sp} />
      <ReconcileAlerts r={reconcile()} />
    </>
  );
}
