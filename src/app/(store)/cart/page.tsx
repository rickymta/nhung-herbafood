import { CartView } from "@/components/store/CartView";
import { getSettings } from "@/lib/store/queries";

export const metadata = { title: "Giỏ hàng — TNStrokeGuard" };

export default function CartPage() {
  const s = getSettings();
  return <CartView threshold={Number(s.free_ship_threshold || 500000)} shipFee={Number(s.shipping_fee || 30000)} />;
}
