import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cvs = await prisma.cV.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(cvs);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.cV.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { id, selected } = await req.json();
  const cv = await prisma.cV.update({
    where: { id },
    data: { selected },
  });
  return NextResponse.json(cv);
}
