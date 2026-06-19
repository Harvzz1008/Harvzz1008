import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(_request: NextRequest) {
  const events = await db.event.findMany({
    where: { active: true, date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  })
  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, date, location, price, image, capacity } = body

  if (!name || !description || !date || !location || price == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const event = await db.event.create({
    data: {
      name,
      description,
      date: new Date(date),
      location,
      price: parseFloat(price),
      image: image || null,
      capacity: parseInt(capacity) || 100,
    },
  })

  return NextResponse.json(event, { status: 201 })
}
