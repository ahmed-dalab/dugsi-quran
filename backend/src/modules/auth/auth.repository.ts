import { prisma } from "../../config/prisma";

export const authRepository = {
  createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    userAgent?: string | null;
    ipAddress?: string | null;
  }) {
    return prisma.refreshToken.create({ data });
  },

  findActiveByTokenHash(tokenHash: string) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
    });
  },

  revokeByTokenHash(tokenHash: string) {
    return prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },

  revokeAndReplace(existingId: string, replacedByTokenHash: string) {
    return prisma.refreshToken.update({
      where: { id: existingId },
      data: {
        revokedAt: new Date(),
        replacedByTokenHash,
      },
    });
  },
};
