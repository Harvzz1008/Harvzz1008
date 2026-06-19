'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ArrowLeft, Minus, Plus, Ticket, Users } from 'lucide-react'

type Event = {
  id: string
  name: string
  description: string
  date: string
  location: string
  price: number
  image?: string | null
  capacity: number
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [purchasing, setPurchasing] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data)
      }
      setLoading(false)
    }
    fetchEvent()
  }, [id])

  const handleBuyTickets = async () => {
    if (!event) return
    setPurchasing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ticket',
          eventId: event.id,
          items: [{ quantity }],
          guestName: guestName || undefined,
          guestEmail: guestEmail || undefined,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Checkout failed. Please try again.')
      }
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-72 bg-gray-200 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-24 bg-gray-200 rounded mb-4" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h1>
        <Link href="/events" className="text-indigo-600 hover:underline">
          &larr; Back to Events
        </Link>
      </div>
    )
  }

  const date = new Date(event.date)
  const formattedDate = date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Back to Events
      </Link>

      {/* Event image */}
      <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-gray-100 mb-8">
        <Image
          src={event.image || 'https://placehold.co/800x400/4F46E5/fff?text=Event'}
          alt={event.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Event details */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} className="text-indigo-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="text-indigo-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users size={18} className="text-indigo-500" />
              <span>Capacity: {event.capacity}</span>
            </div>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{event.description}</p>
          </div>
        </div>

        {/* Right: Purchase tickets */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <p className="text-3xl font-bold text-gray-900 mb-1">
            £{event.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mb-4">per ticket · Starts {formattedTime}</p>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-gray-700 font-medium">Tickets</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-50 transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 py-2 font-semibold text-gray-900 min-w-10 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-2.5 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-center py-3 border-t border-b border-gray-100 mb-5">
            <span className="text-gray-600">Total</span>
            <span className="font-bold text-gray-900 text-lg">
              £{(event.price * quantity).toFixed(2)}
            </span>
          </div>

          {/* Guest info */}
          <div className="space-y-3 mb-5">
            <p className="text-sm text-gray-500 font-medium">
              If not signed in, enter your details:
            </p>
            <input
              type="text"
              placeholder="Your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Your email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleBuyTickets}
            disabled={purchasing}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Ticket size={18} />
            {purchasing ? 'Redirecting...' : 'Buy Tickets'}
          </button>
        </div>
      </div>
    </div>
  )
}
