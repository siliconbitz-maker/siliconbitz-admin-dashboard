// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global across hot-reloads in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query'], // remove in production if noisy
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
