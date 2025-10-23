import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ✅ GET: Fetch all CVs
export async function GET() {
  try {
    const cvs = await prisma.cV.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(cvs)
  } catch (error) {
    console.error('GET /api/cvs error:', error)
    return NextResponse.json({ error: 'Failed to load CVs' }, { status: 500 })
  }
}

// ✅ DELETE: Delete a CV
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'CV ID required' }, { status: 400 })

    await prisma.cV.delete({ where: { id } })
    return NextResponse.json({ message: 'CV deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/cvs error:', error)
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 })
  }
}
