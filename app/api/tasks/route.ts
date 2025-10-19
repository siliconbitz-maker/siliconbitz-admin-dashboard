import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: { user: true, project: true },
  });
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, description, difficulty, userId, projectId, deadline } = await req.json();

  if (!name || !projectId) return new NextResponse("Bad Request", { status: 400 });

  const task = await prisma.task.create({
    data: {
      name,
      description,
      difficulty,
      projectId,
      userId: userId || null, // allow assignment to other user or self
      deadline: new Date(deadline),
      status: "todo",
    },
    include: { user: true, project: true },
  });

  return NextResponse.json({ task });
}

export async function PUT(req: NextRequest) {
  const { id, status, elapsedTime } = await req.json(); // elapsedTime in seconds

  if (!id || !status) return new NextResponse("Bad Request", { status: 400 });

  const task = await prisma.task.update({
    where: { id },
    data: {
      status,
      ...(elapsedTime ? { timeSpent: { increment: elapsedTime } } : {}),
    },
    include: { user: true, project: true },
  });

  return NextResponse.json({ task });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return new NextResponse("Bad Request", { status: 400 });

  await prisma.task.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
