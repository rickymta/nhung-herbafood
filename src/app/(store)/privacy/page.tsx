import { PolicyPage } from "@/components/store/PolicyPage";
import { POLICY_PAGES } from "@/lib/store/content";

export const metadata = { title: POLICY_PAGES["privacy"].title + " — TNStrokeGuard" };

export default function Page() {
  return <PolicyPage id="privacy" />;
}
