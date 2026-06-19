import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Create sample products
  const products = await Promise.all([
    db.product.upsert({
      where: { id: 'seed-product-1' },
      update: {},
      create: {
        id: 'seed-product-1',
        name: 'Classic White T-Shirt',
        description: 'A timeless classic white t-shirt made from 100% organic cotton. Comfortable and versatile for any occasion.',
        price: 24.99,
        image: 'https://placehold.co/600x400/f5f5f5/333?text=T-Shirt',
        category: 'clothing',
        stock: 50,
        active: true,
      },
    }),
    db.product.upsert({
      where: { id: 'seed-product-2' },
      update: {},
      create: {
        id: 'seed-product-2',
        name: 'Leather Wallet',
        description: 'Premium genuine leather wallet with multiple card slots and a coin pocket. Slim design fits easily in your pocket.',
        price: 49.99,
        image: 'https://placehold.co/600x400/8B4513/fff?text=Wallet',
        category: 'accessories',
        stock: 30,
        active: true,
      },
    }),
    db.product.upsert({
      where: { id: 'seed-product-3' },
      update: {},
      create: {
        id: 'seed-product-3',
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life.',
        price: 149.99,
        image: 'https://placehold.co/600x400/2563EB/fff?text=Headphones',
        category: 'electronics',
        stock: 15,
        active: true,
      },
    }),
    db.product.upsert({
      where: { id: 'seed-product-4' },
      update: {},
      create: {
        id: 'seed-product-4',
        name: 'Scented Candle Set',
        description: 'A beautiful set of 3 hand-poured soy candles in lavender, vanilla, and cedarwood scents.',
        price: 34.99,
        image: 'https://placehold.co/600x400/DDA0DD/fff?text=Candles',
        category: 'home',
        stock: 40,
        active: true,
      },
    }),
    db.product.upsert({
      where: { id: 'seed-product-5' },
      update: {},
      create: {
        id: 'seed-product-5',
        name: 'Running Shoes',
        description: 'Lightweight and responsive running shoes with superior cushioning for maximum comfort on long runs.',
        price: 89.99,
        image: 'https://placehold.co/600x400/10B981/fff?text=Shoes',
        category: 'clothing',
        stock: 25,
        active: true,
      },
    }),
    db.product.upsert({
      where: { id: 'seed-product-6' },
      update: {},
      create: {
        id: 'seed-product-6',
        name: 'Stainless Steel Water Bottle',
        description: 'Eco-friendly 750ml insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        price: 29.99,
        image: 'https://placehold.co/600x400/6366F1/fff?text=Bottle',
        category: 'accessories',
        stock: 60,
        active: true,
      },
    }),
  ])

  // Create sample events
  const now = new Date()
  const events = await Promise.all([
    db.event.upsert({
      where: { id: 'seed-event-1' },
      update: {},
      create: {
        id: 'seed-event-1',
        name: 'Summer Music Festival',
        description: 'Join us for an unforgettable evening of live music featuring local and international artists across multiple stages.',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        location: 'City Park Amphitheatre, London',
        price: 35.00,
        image: 'https://placehold.co/800x400/7C3AED/fff?text=Music+Festival',
        capacity: 500,
        active: true,
      },
    }),
    db.event.upsert({
      where: { id: 'seed-event-2' },
      update: {},
      create: {
        id: 'seed-event-2',
        name: 'Art & Wine Evening',
        description: 'A sophisticated evening of curated art and fine wine tasting. Meet the artists and discover new works.',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        location: 'The Gallery, Shoreditch',
        price: 55.00,
        image: 'https://placehold.co/800x400/DC2626/fff?text=Art+%26+Wine',
        capacity: 100,
        active: true,
      },
    }),
    db.event.upsert({
      where: { id: 'seed-event-3' },
      update: {},
      create: {
        id: 'seed-event-3',
        name: 'Comedy Night',
        description: 'Laugh out loud with our monthly comedy night featuring some of the UK\'s finest stand-up comedians.',
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
        location: 'The Comedy Club, Manchester',
        price: 25.00,
        image: 'https://placehold.co/800x400/F59E0B/fff?text=Comedy+Night',
        capacity: 200,
        active: true,
      },
    }),
  ])

  return NextResponse.json({
    message: 'Seed data created successfully',
    products: products.length,
    events: events.length,
  })
}
