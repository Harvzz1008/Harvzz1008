import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata

    if (!metadata) return NextResponse.json({ received: true })

    if (metadata.type === 'order' && metadata.orderId) {
      await db.order.update({
        where: { id: metadata.orderId },
        data: { status: 'PAID' },
      })
    }

    if (metadata.type === 'ticket' && metadata.ticketId) {
      await db.ticket.update({
        where: { id: metadata.ticketId },
        data: { status: 'PAID' },
      })
    }
  }

  return NextResponse.json({ received: true })
}
