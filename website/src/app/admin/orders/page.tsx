import { db } from '@/lib/db'
import { ClipboardList } from 'lucide-react'

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      items: { include: { product: true } },
      user: { select: { email: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-green-100 text-green-700',
    FULFILLED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} orders total</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <ClipboardList size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-medium text-gray-700">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Order</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Items</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Delivery</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-700">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">
                      {order.user?.name || order.guestName || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.email || order.guestEmail || '—'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 max-w-48 line-clamp-2">
                      {order.items.map((item) => `${item.product.name} ×${item.quantity}`).join(', ')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">
                      {order.deliveryMethod.toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">£{order.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
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
