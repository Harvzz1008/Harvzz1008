'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export default function CartPage() {
  const { cart, total, removeFromCart, updateQuantity } = useCart()

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <ShoppingCart size={64} className="mx-auto mb-6 text-gray-300" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
        >
          <ShoppingCart size={20} />
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm"
            >
              <div className="relative w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={item.image || 'https://placehold.co/200x200/f3f4f6/6b7280?text=Product'}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-indigo-600 font-bold mt-0.5">£{item.price.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 font-medium text-gray-900 min-w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-gray-900">
                  £{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Order Summary</h2>
          <div className="space-y-3 mb-5">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span className="truncate max-w-36">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900 ml-2">
                  £{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">
                £{total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Delivery fee calculated at checkout</p>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Proceed to Checkout
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-gray-500 hover:text-indigo-600 text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
