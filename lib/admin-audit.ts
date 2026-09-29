import { prisma } from "@/lib/prisma";

export async function writeAdminAudit(action: string, entity: string, entityId?: string, metadata?: Record<string, unknown>) {
  await prisma.auditLog.create({ data: { action, entity, entityId, metadata: metadata ? JSON.stringify(metadata) : null } });
}
