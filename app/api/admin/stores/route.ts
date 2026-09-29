import { NextRequest, NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
export async function GET() { if (!(await isAdminSessionValid())) return error("Дастрасӣ манъ аст.", 401); const stores = await prisma.store.findMany({ include: { owner: { select: { name: true, phone: true } }, _count: { select: { products: true, orders: true } } }, orderBy: { createdAt: "desc" } }); return NextResponse.json({ stores }); }
export async function PATCH(request: NextRequest) { if (!(await isAdminSessionValid())) return error("Дастрасӣ манъ аст.", 401); const body = await request.json().catch(() => null) as { id?: string; status?: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED" } | null; if (!body?.id || !body.status) return error("id ва status заруранд."); const store = await prisma.store.update({ where: { id: body.id }, data: { status: body.status } }); return NextResponse.json({ store }); }
