import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const getPrismaClient = (): PrismaClient => {
  if (globalForPrisma.prisma) {
    const runtimeFields = (globalForPrisma.prisma as any)?._runtimeDataModel?.models?.Project?.fields;
    const hasImagesField =
      Array.isArray(runtimeFields) &&
      runtimeFields.some((f: any) => f.name === "images");

    // Reset cached instance if missing newly added models or schema fields
    if (
      !(globalForPrisma.prisma as any).user ||
      !(globalForPrisma.prisma as any).experience ||
      !hasImagesField
    ) {
      globalForPrisma.prisma = undefined;
    }
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
};

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
