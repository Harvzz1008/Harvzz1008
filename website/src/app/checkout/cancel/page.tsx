import Link from 'next/link'
import { XCircle, ShoppingCart, ArrowLeft } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle size={48} className="text-red-400" />
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Payment Cancelled</h1>
      <p className="text-gray-500 text-lg mb-8">
        Your payment was cancelled. No charge has been made. Your cart items are still saved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/cart"
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
        >
          <ShoppingCart size={20} />
          Return to Cart
        </Link>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
