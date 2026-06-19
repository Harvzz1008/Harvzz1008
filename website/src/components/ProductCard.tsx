'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image?: string | null
  category: string
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      quantity: 1,
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <Link href={`/shop/${product.id}`}>
        <div className="relative h-56 bg-gray-100 overflow-hidden">
          <Image
            src={product.image || 'https://placehold.co/600x400/f3f4f6/6b7280?text=Product'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <Link href={`/shop/${product.id}`}>
          <h3 className="mt-1 text-gray-900 font-semibold text-lg hover:text-indigo-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-900">
            £{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
