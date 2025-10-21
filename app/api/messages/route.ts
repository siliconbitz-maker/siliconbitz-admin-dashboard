import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const room = url.searchParams.get('room');
  const receiverId = url.searchParams.get('receiverId');

  let messages:any;

  if (room) {
    messages = await prisma.message.findMany({
      where: { room },
      include: { sender: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    });
  } else if (receiverId) {
    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: receiverId },
          { receiverId },
        ],
      },
      include: { sender: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    });
  } else {
    messages = [];
  }

  return NextResponse.json({ messages });
}
