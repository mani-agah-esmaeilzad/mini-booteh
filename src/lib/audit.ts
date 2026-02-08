import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function recordAuditLog({
  adminId,
  action,
  metadata,
}: {
  adminId?: string;
  action: string;
  metadata?: Prisma.InputJsonValue;
}) {
  await prisma.auditLog.create({
    data: {
      adminUserId: adminId,
      action,
      metadata,
    },
  });
}
