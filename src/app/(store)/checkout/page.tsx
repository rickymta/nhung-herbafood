import { CheckoutForm } from "@/components/store/CheckoutForm";
import { getSettings } from "@/lib/store/queries";

export const metadata = { title: "Thanh toán — TNStrokeGuard" };

export default function CheckoutPage() {
  const s = getSettings();
  return <CheckoutForm threshold={Number(s.free_ship_threshold || 500000)} shipFee={Number(s.shipping_fee || 30000)} />;
}
