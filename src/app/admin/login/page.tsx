import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin");
  return (
    <div className="adm-login">
      <div className="box">
        <div className="adm-logo" style={{ color: "#0f172a", padding: 0 }}>
          <i style={{ color: "#fff" }}>T<b>N</b></i>
          TN AFFILIATE OS
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "22px 0 4px" }}>Đăng nhập quản trị</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>Hệ thống quản lý chương trình Affiliate & cửa hàng TN Stroke Guard.</p>
        <LoginForm />
      </div>
    </div>
  );
}
