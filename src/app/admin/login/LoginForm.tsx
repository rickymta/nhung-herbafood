"use client";
import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} style={{ display: "grid", gap: 14, marginTop: 22 }}>
      <div>
        <label className="adm-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="adm-input" placeholder="ban@congty.vn" />
      </div>
      <div>
        <label className="adm-label" htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="adm-input" />
      </div>
      {state.error && <div className="adm-note" style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#b91c1c", margin: 0 }}>{state.error}</div>}
      <button type="submit" disabled={pending} className="adm-btn p" style={{ padding: "12px 18px" }}>{pending ? "Đang đăng nhập..." : "Đăng nhập"}</button>
    </form>
  );
}
