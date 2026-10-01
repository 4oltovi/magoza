import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.setting.findMany({ where: { isPublic: true } });
  const settings = Object.fromEntries(rows.map((row) => [row.settingKey, row.value]));
  return NextResponse.json({ settings });
}
