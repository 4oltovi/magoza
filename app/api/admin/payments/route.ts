import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim() ?? "";
  const phone = request.nextUrl.searchParams.get("phone")?.trim() ?? "";
  if (!orderNumber || !phone) return NextResponse.json({ error: "Рақами фармоиш ва телефон зарур аст." }, { status: 400 });
  const order = await prisma.order.findFirst({ where: { orderNumber, buyerPhone: phone }, include: { payment: { select: { status: true, receiptName: true, receiptMime: true, receiptData: true, amount: true, note: true } } } });
  if (!order?.payment) return NextResponse.json({ error: "Фармоиш ёфт нашуд." }, { status: 404 });
  const isReviewable = order.payment.status === PaymentStatus.UNDER_REVIEW;
  return NextResponse.json({ order: { orderNumber: order.orderNumber, status: order.status, total: order.total, buyerName: order.buyerName, buyerPhone: order.buyerPhone, deliveryAddress: order.deliveryAddress, createdAt: order.createdAt, payment: { status: order.payment.status, receiptName: order.payment.receiptName, receiptMime: order.payment.receiptMime, receiptData: isReviewable ? order.payment.receiptData : null, amount: order.payment.amount, note: order.payment.note } } });
}
