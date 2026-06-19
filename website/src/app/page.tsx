import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag, Calendar, Utensils } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import EventCard from '@/components/EventCard'

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.slice(0, 4)
  } catch {
    return []
  }
}

async function getUpcomingEvents() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/events`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.slice(0, 3)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [products, events] = await Promise.all([
    getFeaturedProducts(),
    getUpcomingEvents(),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://placehold.co/1600x600/4F46E5/fff?text=."
            alt="Hero background"
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Welcome to{' '}
            <span className="text-indigo-300">Harvzz</span>
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            Shop our curated collection, attend unforgettable events, and book the perfect dining experience — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors text-lg"
            >
              <ShoppingBag size={20} />
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/events"
              className="flex items-center justify-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors text-lg"
            >
              <Calendar size={20} />
              View Events
            </Link>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full fill-gray-50">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="text-indigo-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Shop</h3>
            <p className="text-gray-500">
              Discover our handpicked selection of premium products. Free pickup or delivered to your door.
            </p>
            <Link href="/shop" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">
              Browse Products &rarr;
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Events & Experiences</h3>
            <p className="text-gray-500">
              From music festivals to intimate wine evenings — find your next unforgettable experience.
            </p>
            <Link href="/events" className="mt-4 inline-block text-purple-600 font-medium hover:underline">
              See Events &rarr;
            </Link>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="text-amber-600" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Table Booking</h3>
            <p className="text-gray-500">
              Reserve your table in seconds. Perfect for date nights, business lunches, or special occasions.
            </p>
            <Link href="/book" className="mt-4 inline-block text-amber-600 font-medium hover:underline">
              Book a Table &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 mt-1">Our most popular items</p>
            </div>
            <Link
              href="/shop"
              className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: {
                id: string
                name: string
                description: string
                price: number
                image?: string | null
                category: string
                stock: number
              }) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No products yet</p>
              <p className="text-sm mt-1">
                Visit the{' '}
                <Link href="/admin" className="text-indigo-600 hover:underline">
                  admin panel
                </Link>{' '}
                to add products.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
              <p className="text-gray-500 mt-1">Don&apos;t miss out on these experiences</p>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
            >
              View All <ArrowRight size={18} />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event: {
                id: string
                name: string
                description: string
                date: string
                location: string
                price: number
                image?: string | null
                capacity: number
              }) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No upcoming events</p>
              <p className="text-sm mt-1">Check back soon for upcoming events.</p>
            </div>
          )}
        </div>
      </section>

      {/* Book a Table CTA */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Utensils size={48} className="mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-extrabold mb-4">Reserve Your Table Today</h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Whether it&apos;s a romantic dinner, a family celebration, or a business lunch — we&apos;ll make it memorable. Book your table in under a minute.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 bg-white text-amber-600 font-bold text-lg px-10 py-4 rounded-2xl hover:bg-amber-50 transition-colors shadow-lg"
          >
            Book a Table Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
