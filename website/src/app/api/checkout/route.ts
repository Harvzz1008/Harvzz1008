import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { getSessionFromRequest } from '@/lib/auth'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request)
  const body = await request.json()
  const { type, items, delivery, address, guestEmail, guestName, userId, eventId } = body

  if (type === 'order') {
    // Shop order checkout
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const effectiveUserId = session?.userId || userId || null
    const effectiveGuestEmail = session ? null : guestEmail
    const effectiveGuestName = session ? null : guestName

    if (!effectiveUserId && (!effectiveGuestEmail || !effectiveGuestName)) {
      return NextResponse.json(
        { error: 'Guest name and email are required' },
        { status: 400 }
      )
    }

    // Fetch products to verify prices
    const productIds = items.map((i: { id: string }) => i.id)
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    const lineItems = items.map((item: { id: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) throw new Error(`Product ${item.id} not found`)
      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      }
    })

    // Add delivery fee if applicable
    if (delivery === 'DELIVERY') {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Delivery Fee' },
          unit_amount: 500, // £5.00
        },
        quantity: 1,
      })
    }

    const total = products.reduce((sum: number, product) => {
      const item = items.find((i: { id: string }) => i.id === product.id)
      return sum + product.price * (item?.quantity || 1)
    }, 0) + (delivery === 'DELIVERY' ? 5 : 0)

    // Create a pending order
    const order = await db.order.create({
      data: {
        userId: effectiveUserId,
        guestEmail: effectiveGuestEmail,
        guestName: effectiveGuestName,
        status: 'PENDING',
        total,
        deliveryMethod: delivery || 'PICKUP',
        deliveryAddress: delivery === 'DELIVERY' ? address : null,
        items: {
          create: items.map((item: { id: string; quantity: number }) => {
            const product = products.find((p) => p.id === item.id)!
            return {
              productId: item.id,
              quantity: item.quantity,
              price: product.price,
            }
          }),
        },
      },
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
      metadata: {
        type: 'order',
        orderId: order.id,
      },
      customer_email: effectiveGuestEmail || session?.email || undefined,
    })

    // Save Stripe session ID to order
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  }

  if (type === 'ticket') {
    // Event ticket checkout
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }

    const event = await db.event.findUnique({ where: { id: eventId } })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const quantity = items?.[0]?.quantity || 1
    const effectiveUserId = session?.userId || userId || null
    const effectiveGuestEmail = session ? null : guestEmail
    const effectiveGuestName = session ? null : guestName

    if (!effectiveUserId && (!effectiveGuestEmail || !effectiveGuestName)) {
      return NextResponse.json(
        { error: 'Guest name and email are required' },
        { status: 400 }
      )
    }

    const totalPrice = event.price * quantity

    // Create pending ticket record
    const ticket = await db.ticket.create({
      data: {
        eventId,
        userId: effectiveUserId,
        guestEmail: effectiveGuestEmail,
        guestName: effectiveGuestName,
        quantity,
        totalPrice,
        status: 'PENDING',
      },
    })

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Ticket: ${event.name}`,
              images: event.image ? [event.image] : [],
            },
            unit_amount: Math.round(event.price * 100),
          },
          quantity,
        },
      ],
      success_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/checkout/cancel`,
      metadata: {
        type: 'ticket',
        ticketId: ticket.id,
      },
      customer_email: effectiveGuestEmail || session?.email || undefined,
    })

    await db.ticket.update({
      where: { id: ticket.id },
      data: { stripeSessionId: checkoutSession.id },
    })

    return NextResponse.json({ url: checkoutSession.url })
  }

  return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 })
}
