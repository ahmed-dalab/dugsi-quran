export interface IRefreshToken {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByTokenHash?: string | null;
  userAgent?: string | null;
  ipAddress?: string | null;
}
