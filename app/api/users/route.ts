import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authUser = await getUserFromRequest(req);
  if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return NextResponse.json({ users });
}
export async function DELETE(req: NextRequest) {
  const authUser = await getUserFromRequest(req);
  if (!authUser)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id)
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });

  const userToDelete = await prisma.user.findUnique({ where: { id } });
  if (!userToDelete)
    return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Prevent deleting the protected email
  if (userToDelete.email === 'sabbirhasan.engr@gmail.com') {
    return NextResponse.json({ error: 'Cannot delete this user' }, { status: 403 });
  }

  // Optional: prevent deleting yourself
  if (authUser.id === id) {
    return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 403 });
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: 'User deleted' });
}

