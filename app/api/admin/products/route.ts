import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function authorized(request: NextRequest) { const key = process.env.ADMIN_PANEL_KEY; return Boolean(key && request.headers.get("x-admin-key") === key); }
function error(message: string, status = 400) { return NextResponse.json({ error: message }, { status }); }

export async function GET(request: NextRequest) {
  if (!authorized(request)) return error("Дастрасӣ манъ аст.", 401);
  const products = await prisma.product.findMany({ include: { store: { select: { id: true, name: true } }, category: { select: { id: true, name: true } } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return error("Дастрасӣ манъ аст.", 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const slug = typeof body?.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const storeId = typeof body?.storeId === "string" ? body.storeId : "";
  const categoryId = typeof body?.categoryId === "string" ? body.categoryId : "";
  const unit = typeof body?.unit === "string" ? body.unit.trim() : "";
  const price = Number(body?.price); const stock = Number(body?.stock);
  if (!name || !/^[a-z0-9-]{2,100}$/.test(slug) || !storeId || !categoryId || !unit || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return error("Номи маҳсулот, slug, мағоза, категория, нарх ва захираро дуруст пур кунед.");
  const product = await prisma.product.create({ data: { name, slug, storeId, categoryId, unit, price: new Prisma.Decimal(price), stock, description: typeof body?.description === "string" ? body.description.trim() : null, isApproved: Boolean(body?.isApproved) } });
  return NextResponse.json({ product }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return error("Дастрасӣ манъ аст.", 401);
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return error("id зарур аст.");
  const data: Prisma.ProductUpdateInput = {};
  if (typeof body?.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body?.price === "number" && body.price >= 0) data.price = new Prisma.Decimal(body.price);
  if (Number.isInteger(body?.stock) && Number(body.stock) >= 0) data.stock = Number(body.stock);
  if (typeof body?.unit === "string" && body.unit.trim()) data.unit = body.unit.trim();
  if (typeof body?.isActive === "boolean") data.isActive = body.isActive;
  if (typeof body?.isApproved === "boolean") data.isApproved = body.isApproved;
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}
