import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { User, Package, Ticket, BookOpen, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

export default async function AccountPage() {
  const session = await getSession()
  if (!session) redirect('/auth/login')

  const [orders, tickets, bookings] = await Promise.all([
    db.order.findMany({
      where: { userId: session.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    db.ticket.findMany({
      where: { userId: session.userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    db.booking.findMany({
      where: { userId: session.userId },
      orderBy: { date: 'desc' },
      take: 10,
    }),
  ])

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-green-100 text-green-700',
    FULFILLED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
    CONFIRMED: 'bg-green-100 text-green-700',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <User size={28} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session.name || 'My Account'}
            </h1>
            <p className="text-gray-500 text-sm">{session.email}</p>
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
          <Package size={24} className="text-indigo-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-gray-500 text-sm mt-0.5">Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
          <Ticket size={24} className="text-purple-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
          <p className="text-gray-500 text-sm mt-0.5">Tickets</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
          <BookOpen size={24} className="text-amber-500 mx-auto mb-2" />
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          <p className="text-gray-500 text-sm mt-0.5">Bookings</p>
        </div>
      </div>

      {/* Orders */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={20} className="text-indigo-500" />
          My Orders
        </h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <Package size={32} className="mx-auto mb-3 opacity-40" />
            <p>No orders yet.</p>
            <Link href="/shop" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-gray-900">£{order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {order.items.map((item) => (
                    <span key={item.id}>
                      {item.product.name} × {item.quantity}
                      {order.items.indexOf(item) < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-400 mt-1 capitalize">
                  {order.deliveryMethod.toLowerCase().replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tickets */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Ticket size={20} className="text-purple-500" />
          My Tickets
        </h2>
        {tickets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <Ticket size={32} className="mx-auto mb-3 opacity-40" />
            <p>No tickets yet.</p>
            <Link href="/events" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{ticket.event.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(ticket.event.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} · {ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                      {ticket.status}
                    </span>
                    <span className="font-bold text-gray-900">£{ticket.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookings */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-amber-500" />
          My Table Bookings
        </h2>
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <BookOpen size={32} className="mx-auto mb-3 opacity-40" />
            <p>No bookings yet.</p>
            <Link href="/book" className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              Book a table
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })} at {booking.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
                      {booking.notes ? ` · ${booking.notes}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
