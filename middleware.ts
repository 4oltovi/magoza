import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, validAdminSession } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (validAdminSession(session)) return NextResponse.next();
  const login = new URL("/admin/login", request.url);
  login.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = { matcher: ["/admin/:path*"] };
