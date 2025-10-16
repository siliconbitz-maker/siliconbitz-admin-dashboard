import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Get the user from the request (cookies)
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, company, items } = body

    if (!name || !company || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + Number(item.price),
      0
    )

    const invoice = await prisma.invoice.create({
      data: {
        name,
        company,
        amount: totalAmount,
        userId: user.id, // ✅ use user.id from cookies
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            price: Number(item.price),
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(invoice)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
