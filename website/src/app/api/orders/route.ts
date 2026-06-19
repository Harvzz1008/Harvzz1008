import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role === 'ADMIN') {
    const orders = await db.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  }

  // Regular user: only their own orders
  const orders = await db.order.findMany({
    where: { userId: session.userId },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}
