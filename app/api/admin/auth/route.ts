import { NextRequest, NextResponse } from "next/server";
import { adminCookieOptions, ADMIN_SESSION_COOKIE, createAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { key?: string } | null;
  const configured = process.env.ADMIN_PANEL_KEY;
  if (!configured || !body?.key || body.key !== configured) return NextResponse.json({ error: "Калиди администратор нодуруст аст." }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
export async function DELETE() { const response = NextResponse.json({ ok: true }); response.cookies.set(ADMIN_SESSION_COOKIE, "", { ...adminCookieOptions, maxAge: 0 }); return response; }
