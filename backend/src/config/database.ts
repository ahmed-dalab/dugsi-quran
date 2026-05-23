import { prisma } from "./prisma";

export const connectDB = async (options?: { exitOnFailure?: boolean }) => {
  const exitOnFailure = options?.exitOnFailure ?? true;

  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);

    if (exitOnFailure) {
      process.exit(1);
    }

    throw error;
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export const isDbConnected = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};
