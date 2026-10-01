import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
  const category = request.nextUrl.searchParams.get("category")?.trim();
  const page = Math.max(Number(request.nextUrl.searchParams.get("page") ?? "1") || 1, 1);
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get("limit") ?? "20") || 20, 1), 100);
  const where = {
    isActive: true,
    isApproved: true,
    ...(search ? { OR: [{ name: { contains: search } }, { store: { name: { contains: search } } }] } : {}),
    ...(category ? { category: { slug: category } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({ where, include: { store: { select: { name: true, slug: true } }, category: { select: { name: true, slug: true } }, images: true }, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where }),
  ]);
  return NextResponse.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
