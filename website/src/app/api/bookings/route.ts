import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role === 'ADMIN') {
    const bookings = await db.booking.findMany({
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(bookings)
  }

  // Regular user: return their own bookings
  const bookings = await db.booking.findMany({
    where: { userId: session.userId },
    orderBy: { date: 'desc' },
  })
  return NextResponse.json(bookings)
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  const body = await request.json()
  const { name, email, phone, date, time, partySize, notes } = body

  if (!name || !email || !phone || !date || !time || !partySize) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const booking = await db.booking.create({
    data: {
      userId: session?.userId || null,
      name,
      email,
      phone,
      date: new Date(date),
      time,
      partySize: parseInt(partySize),
      notes: notes || null,
      status: 'PENDING',
    },
  })

  return NextResponse.json(booking, { status: 201 })
}
