import { NextRequest, NextResponse } from "next/server";
import { PaymentMethod, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const jsonError = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return jsonError("Маълумоти фармоиш нодуруст аст."); }
  if (!body || typeof body !== "object") return jsonError("Маълумоти фармоиш нодуруст аст.");
  const data = body as Record<string, unknown>;
  const buyerName = typeof data.buyerName === "string" ? data.buyerName.trim() : "";
  const buyerPhone = typeof data.buyerPhone === "string" ? data.buyerPhone.trim() : "";
  const deliveryAddress = typeof data.deliveryAddress === "string" ? data.deliveryAddress.trim() : "";
  const storeId = typeof data.storeId === "string" ? data.storeId : "";
  const paymentMethod = data.paymentMethod === "PHONE_TRANSFER" ? PaymentMethod.PHONE_TRANSFER : PaymentMethod.CARD_TRANSFER;
  const rawItems = Array.isArray(data.items) ? data.items : [];
  if (!buyerName || !/^\+?[0-9\s()-]{9,20}$/.test(buyerPhone) || !deliveryAddress || !storeId || rawItems.length === 0) return jsonError("Ном, телефон, суроға, мағоза ва маҳсулотҳоро пур кунед.");
  const items = rawItems.map((item) => ({ productId: typeof item === "object" && item && typeof (item as Record<string, unknown>).productId === "string" ? (item as Record<string, unknown>).productId : "", quantity: typeof item === "object" && item && Number.isInteger((item as Record<string, unknown>).quantity) ? Number((item as Record<string, unknown>).quantity) : 0 })).filter((item) => item.productId && item.quantity > 0 && item.quantity <= 100);
  if (!items.length) return jsonError("Рӯйхати маҳсулот нодуруст аст.");
  const products = await prisma.product.findMany({ where: { id: { in: items.map((item) => item.productId) }, storeId, isActive: true, isApproved: true } });
  if (products.length !== items.length) return jsonError("Яке аз маҳсулотҳо дастрас нест.");
  const productMap = new Map(products.map((product) => [product.id, product]));
  const orderItems = items.map((item) => { const product = productMap.get(item.productId)!; const price = Number(product.price); return { productId: product.id, productName: product.name, price: new Prisma.Decimal(price), quantity: item.quantity, total: new Prisma.Decimal(price * item.quantity) }; });
  const subtotal = orderItems.reduce((sum, item) => sum + Number(item.total), 0);
  const deliverySetting = await prisma.setting.findUnique({ where: { settingKey: "DELIVERY_FEE" } });
  const deliveryFee = Number(deliverySetting?.value ?? 0);
  const order = await prisma.$transaction(async (tx) => {
    const buyer = await tx.user.upsert({ where: { phone: buyerPhone }, update: { name: buyerName }, create: { phone: buyerPhone, name: buyerName } });
    const created = await tx.order.create({ data: { orderNumber: `BK-${Date.now()}`, buyerId: buyer.id, storeId, status: "PENDING_PAYMENT", subtotal: new Prisma.Decimal(subtotal), deliveryFee: new Prisma.Decimal(deliveryFee), total: new Prisma.Decimal(subtotal + deliveryFee), buyerName, buyerPhone, deliveryAddress, deliveryNote: typeof data.deliveryNote === "string" ? data.deliveryNote.trim() : null, items: { create: orderItems }, payment: { create: { method: paymentMethod, amount: new Prisma.Decimal(subtotal + deliveryFee), status: "WAITING" } } }, include: { payment: true } });
    return created;
  });
  return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber, status: order.status, total: order.total, payment: order.payment } }, { status: 201 });
}
