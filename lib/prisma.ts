import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { verifyServerAttributionIntegrity } from "@/lib/integrity.server";

interface RuntimeField {
  name?: string;
}

type PrismaClientInternal = PrismaClient & {
  user?: unknown;
  experience?: unknown;
  skillset?: unknown;
  about?: unknown;
  aboutCard?: unknown;
  contact?: unknown;
  _runtimeDataModel?: {
    models?: {
      Project?: {
        fields?: RuntimeField[];
      };
    };
  };
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  verifyServerAttributionIntegrity();
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

const getPrismaClient = (): PrismaClient => {
  if (globalForPrisma.prisma) {
    const internalPrisma = globalForPrisma.prisma as PrismaClientInternal;
    const runtimeFields = internalPrisma._runtimeDataModel?.models?.Project?.fields;
    const hasImagesField =
      Array.isArray(runtimeFields) &&
      runtimeFields.some((f) => f.name === "images");

    // Reset cached instance if missing newly added models or schema fields
    if (
      !internalPrisma.user ||
      !internalPrisma.experience ||
      !internalPrisma.skillset ||
      !internalPrisma.about ||
      !internalPrisma.aboutCard ||
      !internalPrisma.contact ||
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

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: keyof PrismaClient) {
    const client = getPrismaClient();
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = getPrismaClient();
