// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'please-set-a-secret');
const JWT_EXPIRES_IN = '7d';

// Sign JWT
export async function signJwt(payload: object) {
  return new SignJWT(payload as  any)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

// Verify JWT
export async function verifyJwt(token: string) {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload;
}

// Extract token from request (header or cookie)
export function getTokenFromReq(req: NextRequest) {
  const cookie = req.cookies.get('token')?.value;
  return cookie || null;
}

// Get user from request
export async function getUserFromRequest(req: NextRequest) {
  const token = getTokenFromReq(req);
  if (!token) return null;

  try {
    const payload = await verifyJwt(token) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    return user;
  } catch {
    return null;
  }
}
