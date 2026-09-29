import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function authorized(request: NextRequest) {
  const key = process.env.ADMIN_PANEL_KEY;
  return Boolean(key && request.headers.get("x-admin-key") === key);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Дастрасӣ манъ аст." }, { status: 401 });
  const status = request.nextUrl.searchParams.get("status") as PaymentStatus | null;
  const payments = await prisma.payment.findMany({ where: status && Object.values(PaymentStatus).includes(status) ? { status } : { status: PaymentStatus.UNDER_REVIEW }, include: { order: { select: { orderNumber: true, buyerName: true, buyerPhone: true, total: true, deliveryAddress: true, status: true, createdAt: true } } }, orderBy: { createdAt: "asc" } });
  return NextResponse.json({ payments });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Дастрасӣ манъ аст." }, { status: 401 });
  const body = await request.json().catch(() => null) as { paymentId?: string; decision?: "APPROVED" | "REJECTED"; note?: string } | null;
  if (!body?.paymentId || !body.decision) return NextResponse.json({ error: "paymentId ва decision зарур аст." }, { status: 400 });
  const payment = await prisma.payment.findUnique({ where: { id: body.paymentId }, include: { order: true } });
  if (!payment) return NextResponse.json({ error: "Пардохт ёфт нашуд." }, { status: 404 });
  const approved = body.decision === "APPROVED";
  const result = await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED, note: body.note?.trim() || null, reviewedAt: new Date() } }),
    prisma.order.update({ where: { id: payment.orderId }, data: { status: approved ? "PAYMENT_CONFIRMED" : "PENDING_PAYMENT" } }),
  ]);
  return NextResponse.json({ ok: true, payment: result[0] });
}
