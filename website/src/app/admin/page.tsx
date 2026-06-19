import Link from 'next/link'
import { db } from '@/lib/db'
import {
  ShoppingBag,
  Calendar,
  ClipboardList,
  BookOpen,
  Ticket,
  ArrowRight,
  Zap,
} from 'lucide-react'

export default async function AdminDashboard() {
  const [productCount, eventCount, orderCount, bookingCount, ticketCount, pendingOrders] =
    await Promise.all([
      db.product.count({ where: { active: true } }),
      db.event.count({ where: { active: true } }),
      db.order.count(),
      db.booking.count(),
      db.ticket.count(),
      db.order.count({ where: { status: 'PENDING' } }),
    ])

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, name: true } } },
  })

  const stats = [
    { label: 'Active Products', value: productCount, icon: ShoppingBag, href: '/admin/products', color: 'bg-indigo-500' },
    { label: 'Active Events', value: eventCount, icon: Calendar, href: '/admin/events', color: 'bg-purple-500' },
    { label: 'Total Orders', value: orderCount, icon: ClipboardList, href: '/admin/orders', color: 'bg-blue-500' },
    { label: 'Total Bookings', value: bookingCount, icon: BookOpen, href: '/admin/bookings', color: 'bg-amber-500' },
    { label: 'Tickets Sold', value: ticketCount, icon: Ticket, href: '/admin/tickets', color: 'bg-pink-500' },
    { label: 'Pending Orders', value: pendingOrders, icon: ClipboardList, href: '/admin/orders', color: 'bg-orange-500' },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-green-100 text-green-700',
    FULFILLED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your store</p>
        </div>
        <form action="/api/admin/seed" method="POST">
          <button
            type="button"
            onClick={async () => {
              const r = await fetch('/api/admin/seed', { method: 'POST' })
              const d = await r.json()
              alert(d.message || 'Done')
              window.location.reload()
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <Zap size={16} />
            Seed Demo Data
          </button>
        </form>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className={`w-11 h-11 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={22} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
            <div className="flex items-center gap-1 text-indigo-500 text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              View all <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-indigo-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <ClipboardList size={32} className="mx-auto mb-3 opacity-40" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.user?.email || order.guestEmail || 'Guest'} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-gray-900">£{order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
