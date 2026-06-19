import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const event = await db.event.findUnique({ where: { id } })
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  return NextResponse.json(event)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { name, description, date, location, price, image, capacity, active } = body

  const event = await db.event.update({
    where: { id },
    data: {
      name,
      description,
      date: date ? new Date(date) : undefined,
      location,
      price: price != null ? parseFloat(price) : undefined,
      image,
      capacity: capacity != null ? parseInt(capacity) : undefined,
      active,
    },
  })

  return NextResponse.json(event)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await db.event.update({ where: { id }, data: { active: false } })
  return NextResponse.json({ success: true })
}
