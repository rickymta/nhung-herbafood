import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getAlerts } from "@/lib/admin/dashboard";
import Shell from "@/components/admin/Shell";
import { FlashToast } from "@/components/admin/client";
import { logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  const alerts = getAlerts();
  return (
    <Shell user={{ name: user.name, email: user.email, role: user.role }} alerts={alerts} logout={logoutAction}>
      {children}
      <Suspense fallback={null}>
        <FlashToast />
      </Suspense>
    </Shell>
  );
}
