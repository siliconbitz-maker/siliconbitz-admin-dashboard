import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}