import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET() {
  try {
    const interviews = await prisma.interview.findMany({
      include: {
        cv: true,
        interviewer: {
          select: { id: true, name: true, email: true },
        },
        // ✅ Include all assigned interviewers
        interviewers: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { dateTime: 'desc' },
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error('GET /api/interviews error:', error)
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 })
  }
}
export async function POST(req: NextRequest) {
  try {
    const { cvId, title, dateTime, interviewers, meetingLink } = await req.json()

    if (!cvId || !title || !dateTime || !interviewers?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const interview = await prisma.interview.create({
      data: {
        title,
        dateTime: new Date(dateTime),
        meetingLink,
        cv: { connect: { id: cvId } },
        interviewer: { connect: { id: interviewers[0] } },
      },
    })

    const assignments = interviewers.map((uid: string) => ({
      interviewId: interview.id,
      userId: uid,
    }))
    await prisma.interviewerOnInterview.createMany({ data: assignments })

    return NextResponse.json({ success: true, interview })
  } catch (error: any) {
    console.error('❌ Error creating interview:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create interview' },
      { status: 500 }
    )
  }
}
