// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== 'admin@siliconbitz.com') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { name, deadline, teamMembers } = body;

  if (!name || !deadline) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      deadline: new Date(deadline),
      teamMembers: Array.isArray(teamMembers) ? teamMembers.join(',') : (teamMembers || ''),
      createdBy: user.email,
    },
  });

  return NextResponse.json({ project });
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== 'admin@siliconbitz.com') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { id, name, deadline, teamMembers } = body;

  if (!id) return new NextResponse('Bad Request', { status: 400 });

  const project = await prisma.project.update({
    where: { id },
    data: {
      name,
      deadline: deadline ? new Date(deadline) : undefined,
      teamMembers: Array.isArray(teamMembers) ? teamMembers.join(',') : teamMembers,
    },
  });

  return NextResponse.json({ project });
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.email !== 'admin@siliconbitz.com') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const { id } = body;
  if (!id) return new NextResponse('Bad Request', { status: 400 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
