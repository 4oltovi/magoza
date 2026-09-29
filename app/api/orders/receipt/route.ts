import { NextRequest, NextResponse } from "next/server";
import { PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 5 * 1024 * 1024;
const allowed = new Set(["image/jpeg", "image/png", "application/pdf"]);

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const orderNumber = String(form.get("orderNumber") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const file = form.get("receipt");
  if (!orderNumber || !phone || !(file instanceof File)) return NextResponse.json({ error: "Рақами фармоиш, телефон ва расид зарур аст." }, { status: 400 });
  if (!allowed.has(file.type) || file.size === 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "Расид бояд JPG, PNG ё PDF ва то 5MB бошад." }, { status: 400 });
  const order = await prisma.order.findFirst({ where: { orderNumber, buyerPhone: phone }, include: { payment: true } });
  if (!order?.payment) return NextResponse.json({ error: "Фармоиш ёфт нашуд." }, { status: 404 });
  if (!["PENDING_PAYMENT", "PAYMENT_REVIEW"].includes(order.status)) return NextResponse.json({ error: "Барои ин фармоиш дигар расид қабул намешавад." }, { status: 409 });
  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;
  await prisma.$transaction([
    prisma.payment.update({ where: { id: order.payment.id }, data: { status: PaymentStatus.UNDER_REVIEW, receiptName: file.name.slice(0, 180), receiptMime: file.type, receiptData: dataUri } }),
    prisma.order.update({ where: { id: order.id }, data: { status: "PAYMENT_REVIEW" } }),
  ]);
  return NextResponse.json({ ok: true, message: "Расид қабул шуд ва барои санҷиш фиристода шуд." });
}
