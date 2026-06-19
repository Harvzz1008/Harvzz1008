'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Truck, Store, CreditCard, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const [delivery, setDelivery] = useState<'PICKUP' | 'DELIVERY'>('PICKUP')
  const [address, setAddress] = useState('')
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const deliveryFee = delivery === 'DELIVERY' ? 5 : 0
  const orderTotal = total + deliveryFee

  const handleCheckout = async () => {
    if (cart.items.length === 0) return
    if (delivery === 'DELIVERY' && !address) {
      setError('Please enter a delivery address.')
      return
    }
    if (!guestName || !guestEmail) {
      setError('Please enter your name and email.')
      return
    }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'order',
          items: cart.items.map((item) => ({ id: item.id, quantity: item.quantity })),
          delivery,
          address: delivery === 'DELIVERY' ? address : undefined,
          guestName,
          guestEmail,
        }),
      })
      const data = await res.json()
      if (data.url) {
        clearCart()
        window.location.href = data.url
      } else {
        setError(data.error || 'Checkout failed. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingCart size={64} className="mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors mt-4"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Forms */}
        <div className="space-y-6">
          {/* Guest info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Delivery method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDelivery('PICKUP')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  delivery === 'PICKUP'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Store size={24} className={delivery === 'PICKUP' ? 'text-indigo-600' : 'text-gray-400'} />
                <span className={`font-medium text-sm ${delivery === 'PICKUP' ? 'text-indigo-700' : 'text-gray-600'}`}>
                  Shop Pickup
                </span>
                <span className="text-xs text-gray-400">Free</span>
              </button>
              <button
                onClick={() => setDelivery('DELIVERY')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${
                  delivery === 'DELIVERY'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Truck size={24} className={delivery === 'DELIVERY' ? 'text-indigo-600' : 'text-gray-400'} />
                <span className={`font-medium text-sm ${delivery === 'DELIVERY' ? 'text-indigo-700' : 'text-gray-600'}`}>
                  Home Delivery
                </span>
                <span className="text-xs text-gray-400">£5.00</span>
              </button>
            </div>

            {delivery === 'DELIVERY' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 High Street, London, EC1A 1BB"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.image || 'https://placehold.co/100x100/f3f4f6/6b7280?text=P'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">× {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 shrink-0">
                    £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>{deliveryFee > 0 ? `£${deliveryFee.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>£{orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-lg"
            >
              <CreditCard size={20} />
              {loading ? 'Redirecting to payment...' : 'Pay with Stripe'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Secured by Stripe. Your payment info is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
