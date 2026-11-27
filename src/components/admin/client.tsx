"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** GET filter form that submits on change (selects) and Enter (text). */
export function FilterForm({ children, action }: { children: ReactNode; action: string }) {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  function submit() {
    const fd = new FormData(ref.current!);
    const q = new URLSearchParams();
    for (const [k, v] of fd.entries()) if (typeof v === "string" && v) q.set(k, v);
    const s = q.toString();
    router.push(s ? `${action}?${s}` : action);
  }
  return (
    <form
      ref={ref}
      className="adm-filters"
      onChange={(e) => {
        if ((e.target as HTMLElement).tagName === "SELECT") submit();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {children}
    </form>
  );
}

/** Submit button that asks for confirmation first. */
export function ConfirmButton({ children, message, className = "adm-btn", formAction }: { children: ReactNode; message: string; className?: string; formAction?: (fd: FormData) => void | Promise<void> }) {
  return (
    <button
      type="submit"
      formAction={formAction}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

/** Reads ?ok=... after a server action redirect, shows a toast, then strips the param. */
export function FlashToast() {
  const sp = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const ok = sp.get("ok");
  const [msg, setMsg] = useState<string | null>(null);
  const [seen, setSeen] = useState<string | null>(null);
  if (ok && ok !== seen) {
    setSeen(ok);
    setMsg(ok);
  } else if (!ok && seen) setSeen(null);
  useEffect(() => {
    if (!ok) return;
    const q = new URLSearchParams(sp.toString());
    q.delete("ok");
    router.replace(q.toString() ? `${path}?${q}` : path, { scroll: false });
    const t = setTimeout(() => setMsg(null), 3500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ok]);
  return msg ? <div className="adm-toast" role="status">{msg}</div> : null;
}
