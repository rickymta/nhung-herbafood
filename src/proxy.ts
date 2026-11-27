import { NextResponse, type NextRequest } from "next/server";

const REF_COOKIE = "tn_ref";

/**
 * - Optimistic admin guard: no session cookie -> /admin/login (real check in requireAdmin()).
 * - Affiliate tracking: ?ref=CODE on any storefront URL is stored for 30 days and
 *   attached to the order at checkout.
 */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!request.cookies.get("tn_admin_session")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const ref = searchParams.get("ref");
  if (ref && /^[A-Za-z0-9_-]{2,32}$/.test(ref)) {
    const res = NextResponse.next();
    res.cookies.set(REF_COOKIE, ref.toUpperCase(), {
      path: "/",
      maxAge: 30 * 86400,
      sameSite: "lax",
    });
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|images/|assets/).*)"],
};
