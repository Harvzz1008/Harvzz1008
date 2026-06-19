import { db } from '@/lib/db'
import { BookOpen } from 'lucide-react'

export default async function AdminBookingsPage() {
  const bookings = await db.booking.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: { date: 'desc' },
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Table Bookings</h1>
        <p className="text-gray-500 mt-1">{bookings.length} bookings total</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium text-gray-700">No bookings yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Guest</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Party Size</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Notes</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{booking.name}</p>
                    {booking.user && (
                      <p className="text-xs text-gray-400">
                        {booking.user.email}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{booking.email}</p>
                    <p className="text-xs text-gray-400">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {new Date(booking.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">{booking.time}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{booking.partySize} guests</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-40 line-clamp-2">
                      {booking.notes || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
