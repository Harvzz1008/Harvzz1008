'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, Minus, Plus, Tag } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

type Product = {
  id: string
  name: string
  description: string
  price: number
  image?: string | null
  category: string
  stock: number
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`)
      if (res.ok) {
        const data = await res.json()
        setProduct(data)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || undefined,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
            <div className="h-14 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
        <Link href="/shop" className="text-indigo-600 hover:underline">
          &larr; Back to Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative h-96 md:h-full min-h-80 bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={product.image || 'https://placehold.co/600x600/f3f4f6/6b7280?text=Product'}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Tag size={14} className="text-indigo-500" />
            <span className="text-sm text-indigo-600 font-medium capitalize">{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-4xl font-extrabold text-gray-900 mb-4">
            £{product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              {/* Quantity selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-2 font-semibold text-gray-900 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <ShoppingCart size={22} />
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <Link
                href="/cart"
                className="mt-3 text-center text-gray-500 hover:text-indigo-600 text-sm transition-colors"
              >
                View Cart &rarr;
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
