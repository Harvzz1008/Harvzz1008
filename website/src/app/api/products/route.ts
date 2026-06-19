import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const where: Record<string, unknown> = { active: true }
  if (category) where.category = category
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, price, image, category, stock } = body

  if (!name || !description || price == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const product = await db.product.create({
    data: {
      name,
      description,
      price: parseFloat(price),
      image: image || null,
      category: category || 'general',
      stock: parseInt(stock) || 0,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
