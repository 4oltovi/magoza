import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "sokhtmon_admin_session";
const ttlSeconds = 60 * 60 * 8;

function secret() { return process.env.ADMIN_PANEL_KEY ?? ""; }
function signature(payload: string) { return createHmac("sha256", secret()).update(payload).digest("hex"); }
export function createAdminSession() { const payload = `${Date.now() + ttlSeconds * 1000}`; return `${payload}.${signature(payload)}`; }
export function validAdminSession(value?: string) { if (!value || !secret()) return false; const [expires, provided] = value.split("."); if (!expires || !provided || Number(expires) < Date.now()) return false; const expected = signature(expires); return provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected)); }
export async function isAdminSessionValid() { return validAdminSession((await cookies()).get(ADMIN_SESSION_COOKIE)?.value); }
export const adminCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: ttlSeconds };
