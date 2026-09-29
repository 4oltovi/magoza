import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber")?.trim() ?? "";
  const phone = request.nextUrl.searchParams.get("phone")?.trim() ?? "";
  if (!orderNumber || !phone) return NextResponse.json({ error: "Рақами фармоиш ва телефон зарур аст." }, { status: 400 });
  const order = await prisma.order.findFirst({ where: { orderNumber, buyerPhone: phone }, select: { orderNumber: true, status: true, total: true, deliveryAddress: true, createdAt: true, items: { select: { productName: true, quantity: true, price: true, total: true } }, payment: { select: { method: true, status: true } } } });
  if (!order) return NextResponse.json({ error: "Фармоиш ёфт нашуд." }, { status: 404 });
  return NextResponse.json({ order });
}
