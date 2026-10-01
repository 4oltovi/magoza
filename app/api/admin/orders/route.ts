import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { writeAdminAudit } from "@/lib/admin-audit";
import { prisma } from "@/lib/prisma";

function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }
export async function GET(request: NextRequest) {
  if (!(await isAdminSessionValid())) return error("Дастрасӣ манъ аст.", 401);
  const status = request.nextUrl.searchParams.get("status") as OrderStatus | null;
  const orders = await prisma.order.findMany({ where: status && Object.values(OrderStatus).includes(status) ? { status } : undefined, include: { store: { select: { name: true } }, items: true, payment: { select: { status: true, method: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ orders });
}
export async function PATCH(request: NextRequest) {
  if (!(await isAdminSessionValid())) return error("Дастрасӣ манъ аст.", 401);
  const body = await request.json().catch(() => null) as { id?: string; status?: OrderStatus } | null;
  if (!body?.id || !body.status || !Object.values(OrderStatus).includes(body.status)) return error("id ва status нодуруст аст.");
  const order = await prisma.order.update({ where: { id: body.id }, data: { status: body.status } });
  await writeAdminAudit("ORDER_STATUS_CHANGED", "Order", body.id, { status: body.status });
  return NextResponse.json({ order });
}
