import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const key = process.env.ADMIN_PANEL_KEY;
  if (!key || request.headers.get("x-admin-key") !== key) return NextResponse.json({ error: "Дастрасӣ манъ аст." }, { status: 401 });
  const [stores, categories] = await prisma.$transaction([
    prisma.store.findMany({ where: { status: "APPROVED" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return NextResponse.json({ stores, categories });
}
