import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? '';
  const isNeon = url.includes('neon.tech');
  const isServerless =
    process.env.VERCEL === '1' || typeof process.env.AWS_LAMBDA_FUNCTION_NAME === 'string';

  if (isNeon && isServerless) {
    const { PrismaNeon } = require('@prisma/adapter-neon');
    const adapter = new PrismaNeon({ connectionString: url });
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
