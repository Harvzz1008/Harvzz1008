import Link from 'next/link'
import { CheckCircle, ShoppingBag, Calendar, User } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-gray-500 text-lg mb-8 leading-relaxed">
        Thank you for your order. You&apos;ll receive a confirmation email shortly. If you have an account, you can track your order in your account dashboard.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/account"
          className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <User size={24} className="text-indigo-600" />
          <span className="font-medium text-gray-800 text-sm">View My Orders</span>
        </Link>
        <Link
          href="/shop"
          className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <ShoppingBag size={24} className="text-indigo-600" />
          <span className="font-medium text-gray-800 text-sm">Continue Shopping</span>
        </Link>
        <Link
          href="/events"
          className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all"
        >
          <Calendar size={24} className="text-indigo-600" />
          <span className="font-medium text-gray-800 text-sm">Browse Events</span>
        </Link>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
